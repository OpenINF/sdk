#!/usr/bin/env node
// Checks that the TypeScript examples in every package README compile, and
// that the results they claim are the results they produce.
//
// A README example is the first code a prospective consumer reads, and it is
// the code most likely to rot: it is prose to the compiler and to the test
// runner, so nothing else here would notice it drifting from the API it
// documents. Two examples were already wrong when this was written -- one
// imported a name the package does not export, another imported one name and
// called a different one -- and neither broke anything that was being run.
//
// Every fenced `ts` block is checked two ways:
//
//   compiles -- against the packages as a consumer resolves them, from the
//               built declarations rather than from source, so an example
//               that only works inside the workspace fails here.
//   claims   -- a line ending `// ↪ <value>` is run, and the value compared
//               against what the expression actually returns. A comment that
//               is prose rather than a value is left alone, so `// ↪ narrowed,
//               no cast needed` stays a remark.
//
// A block with no claims is only compiled, which is what makes an example
// that reaches the network or the filesystem safe to include.
//
// Running an example means running code out of this repository's own README
// files, which is the point, and the same posture as running its tests. The
// expression in a claim is the one thing interpolated into what gets run.
// What the check needs beside it -- the value claimed, and where it was
// written -- travels as data through the environment rather than as generated
// source, so `JSON.stringify` is never left standing in for a sanitizer that
// it cannot be.
//
// Run from the repo root, after `pnpm run build`: `pnpm run lint:examples`.

'use strict';

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PACKAGES = path.join(ROOT, 'packages');

/** `expression; // ↪ value` -- the value a README says an example produces. */
const CLAIM =
  /^(?<indent>\s*)(?<expression>.+?);\s*\/\/\s*↪\s*(?<claimed>.+?)\s*$/;

/** Prose after a value, as in `false — a Date, but not a usable one`. */
const ASIDE = /\s+[—-]\s+.*$/;

/**
 * Reads a claimed value as the literal it looks like, or returns undefined
 * when the comment is prose rather than a value. Deliberately not `eval`: the
 * point is to recognize a literal, and anything else is a remark.
 */
/**
 * Splits an array literal's elements at its own commas, so that a nested
 * array or a string holding one is not cut through the middle.
 */
function elementsOf(inner) {
  const parts = [];
  let depth = 0;
  let quote = '';
  let current = '';

  for (const character of inner) {
    if (quote !== '') {
      current += character;
      if (character === quote) quote = '';
      continue;
    }

    if (character === "'" || character === '"') quote = character;
    else if (character === '[') depth += 1;
    else if (character === ']') depth -= 1;
    else if (character === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }

    current += character;
  }

  parts.push(current);

  return parts;
}

/** Reads one literal, with nothing trimmed from it. */
function literalOf(source) {
  if (source === 'true') return { value: true };
  if (source === 'false') return { value: false };
  if (source === 'null') return { value: null };
  if (source === 'undefined') return { value: undefined };
  if (/^-?\d+(?:\.\d+)?$/.test(source)) return { value: Number(source) };

  const quoted = source.match(/^'([^']*)'$|^"([^"]*)"$/);
  if (quoted !== null) return { value: quoted[1] ?? quoted[2] ?? '' };

  if (source.startsWith('[') && source.endsWith(']')) {
    const inner = source.slice(1, -1).trim();
    if (inner === '') return { value: [] };

    const parts = elementsOf(inner).map((part) => readLiteral(part));
    if (parts.some((part) => part === undefined)) return undefined;

    return { value: parts.map((part) => part.value) };
  }

  return undefined;
}

function readLiteral(text) {
  // Whole first: a string can hold the dash an aside starts with, and
  // `'a - b'` read the other way around parses as nothing and goes unchecked.
  return literalOf(text.trim()) ?? literalOf(text.replace(ASIDE, '').trim());
}

/** Formats a value the way a README writes one. */
function show(value) {
  if (typeof value === 'string') return `'${value}'`;
  if (Array.isArray(value))
    return `[${value.map((item) => show(item)).join(', ')}]`;

  return String(value);
}

/** Every fenced `ts` block in one README, with the line each starts at. */
function examplesIn(markdown) {
  const found = [];
  const lines = markdown.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index] !== '```ts') continue;

    const start = index;
    index += 1;
    const body = [];
    while (index < lines.length && lines[index] !== '```') {
      body.push(lines[index]);
      index += 1;
    }
    found.push({ line: start + 2, body });
  }

  return found;
}

const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-examples-'));
const modules = path.join(scratch, 'node_modules', '@openinf');
fs.mkdirSync(modules, { recursive: true });

const names = fs
  .readdirSync(PACKAGES, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

for (const name of names) {
  const manifest = path.join(PACKAGES, name, 'package.json');
  if (!fs.existsSync(manifest)) continue;

  const { name: scoped } = JSON.parse(fs.readFileSync(manifest, 'utf8'));
  fs.symlinkSync(
    path.join(PACKAGES, name),
    path.join(modules, scoped.replace('@openinf/', ''))
  );
}

const PRELUDE = `const __expected = JSON.parse(process.env.README_CLAIMS ?? '[]');
const __claims = [];
const __show = (value) =>
  typeof value === 'string'
    ? "'" + value + "'"
    : Array.isArray(value)
      ? '[' + value.map(__show).join(', ') + ']'
      : String(value);
function __claim(thunk, at) {
  const { expected, where } = __expected[at];
  let actual;
  try {
    actual = thunk();
  } catch (error) {
    __claims.push(where + '\\n      threw ' + String(error));
    return;
  }
  if (__show(actual) !== expected) {
    __claims.push(where + '\\n      claims ' + expected + '\\n      gives  ' + __show(actual));
  }
}
process.on('exit', () => {
  if (__claims.length > 0) {
    console.error(__claims.join('\\n'));
    process.exitCode = 1;
  }
});
`;

const blocks = [];

for (const name of names) {
  const readme = path.join(PACKAGES, name, 'README.md');
  if (!fs.existsSync(readme)) continue;

  for (const [index, example] of examplesIn(
    fs.readFileSync(readme, 'utf8')
  ).entries()) {
    const claims = [];
    const running = example.body.map((line, row) => {
      const found = line.match(CLAIM);
      if (found === null) return line;

      const literal = readLiteral(found.groups.claimed);
      if (literal === undefined) return line;

      const at = claims.length;
      claims.push({
        expected: show(literal.value),
        where: `${name}/README.md:${example.line + row}`,
      });

      return `${found.groups.indent}__claim(() => (${found.groups.expression}), ${at});`;
    });

    blocks.push({
      name,
      index,
      line: example.line,
      compile: path.join(scratch, `${name}__${index}.mts`),
      run:
        claims.length > 0
          ? path.join(scratch, `${name}__${index}.run.mts`)
          : '',
      claims,
    });

    fs.writeFileSync(
      path.join(scratch, `${name}__${index}.mts`),
      `${example.body.join('\n')}\n`
    );
    if (claims.length > 0) {
      fs.writeFileSync(
        path.join(scratch, `${name}__${index}.run.mts`),
        `${PRELUDE}${running.join('\n')}\n`
      );
    }
  }
}

fs.writeFileSync(
  path.join(scratch, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        allowImportingTsExtensions: true,
        lib: ['esnext'],
        module: 'esnext',
        moduleResolution: 'bundler',
        noEmit: true,
        skipLibCheck: true,
        strict: true,
        target: 'esnext',
        types: ['node'],
        typeRoots: [path.join(ROOT, 'node_modules', '@types')],
      },
      include: ['*.mts'],
      exclude: ['*.run.mts'],
    },
    null,
    2
  )
);

const failures = [];

try {
  execFileSync(path.join(ROOT, 'node_modules', '.bin', 'tsc'), ['-p', '.'], {
    cwd: scratch,
    encoding: 'utf8',
    stdio: 'pipe',
  });
} catch (error) {
  const output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
  for (const line of output.split('\n').filter(Boolean)) {
    const found = line.match(
      /^(?<file>[^(]+)__(?<index>\d+)\.mts\((?<row>\d+),/
    );
    if (found === null) {
      failures.push(`  ${line}`);
      continue;
    }

    const block = blocks.find(
      (entry) =>
        entry.name === found.groups.file &&
        entry.index === Number(found.groups.index)
    );
    const where = block
      ? `${block.name}/README.md:${block.line + Number(found.groups.row) - 1}`
      : line;
    failures.push(`  ${where}\n      ${line.slice(line.indexOf(': ') + 2)}`);
  }
}

for (const block of blocks) {
  if (block.run === '') continue;

  try {
    execFileSync(process.execPath, [block.run], {
      cwd: scratch,
      encoding: 'utf8',
      stdio: 'pipe',
      env: { ...process.env, README_CLAIMS: JSON.stringify(block.claims) },
    });
  } catch (error) {
    failures.push(`  ${`${error.stderr ?? ''}`.trimEnd()}`);
  }
}

fs.rmSync(scratch, { recursive: true, force: true });

const claimed = blocks.reduce((total, block) => total + block.claims.length, 0);

// Finding nothing is a failure, not a pass. A fence that stopped matching --
// a renamed language tag, a line ending nobody expected -- would otherwise
// leave this reporting success over zero examples.
if (blocks.length === 0) {
  console.error('No `ts` examples found in any package README.');
  process.exit(1);
}

if (failures.length > 0) {
  console.error(
    `The README examples do not hold up:\n\n${failures.join('\n')}\n`
  );
  process.exit(1);
}

console.info(
  `Checked ${blocks.length} README examples and the ${claimed} results they claim.`
);
