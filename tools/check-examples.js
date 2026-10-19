#!/usr/bin/env node
// Checks that the TypeScript examples in every package README, and in every
// `@example` of the doc comments in package sources, compile, and that the
// results they claim are the results they produce.
//
// An example is the first code a prospective consumer reads, and it is the
// code most likely to rot: it is prose to the compiler and to the test runner,
// so nothing else here would notice it drifting from the API it documents.
// The doc comment examples matter as much as the README ones, since TypeDoc
// puts them on every page of the API reference.
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
// An `@example` has to hold a fenced `ts` block. One written as bare lines
// would be skipped here, so it fails instead of passing unread.
//
// Running an example means running code out of this repository's own README
// files and sources, which is the point, and the same posture as running its
// tests. The expression in a claim is the one thing interpolated into what
// gets run. What the check needs beside it -- the value claimed, and where it
// was written -- travels as data through the environment rather than as
// generated source, so `JSON.stringify` is never left standing in for a
// sanitizer that it cannot be.
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

/** Every fenced `ts` block in some lines, with the line each starts at. */
function examplesIn(lines) {
  const found = [];

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

/** A doc comment's lines with the leading ` * ` of each taken off. */
const COMMENT = /\/\*\*[\s\S]*?\*\//g;
const MARGIN = /^\s*\*(?: |$)/;

/** Every `ts` block of every `@example` in one source file. */
function docExamplesIn(source, file) {
  const found = [];
  const unfenced = [];

  for (const comment of source.matchAll(COMMENT)) {
    const first = source.slice(0, comment.index).split('\n').length;
    const lines = comment[0]
      .replace(/^\/\*\*/, '')
      .replace(/\*\/$/, '')
      .split('\n')
      .map((line) => line.replace(MARGIN, ''));

    for (let index = 0; index < lines.length; index += 1) {
      if (!/^@example\b/.test(lines[index].trim())) continue;

      // The example runs to the next tag, but a decorator inside a fence is
      // code, not a tag.
      const start = index;
      let fenced = false;
      index += 1;
      while (index < lines.length) {
        if (lines[index].startsWith('```')) fenced = !fenced;
        else if (!fenced && /^@\w/.test(lines[index].trim())) break;
        index += 1;
      }
      const section = lines.slice(start + 1, index);
      index -= 1;

      const blocks = examplesIn(section);
      if (blocks.length === 0) {
        unfenced.push(`${file}:${first + start}`);
        continue;
      }
      for (const block of blocks) {
        found.push({ line: first + start + block.line - 1, body: block.body });
      }
    }
  }

  return { found, unfenced };
}

/** Every `.ts` file under a directory, in a stable order. */
function sourcesUnder(directory) {
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort();
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
const unfenced = [];
const examples = [];

for (const name of names) {
  const readme = path.join(PACKAGES, name, 'README.md');
  if (fs.existsSync(readme)) {
    for (const example of examplesIn(
      fs.readFileSync(readme, 'utf8').split(/\r?\n/)
    )) {
      examples.push({ ...example, file: `${name}/README.md` });
    }
  }

  for (const source of sourcesUnder(path.join(PACKAGES, name, 'src'))) {
    const file = path.relative(PACKAGES, source).split(path.sep).join('/');
    const found = docExamplesIn(fs.readFileSync(source, 'utf8'), file);
    unfenced.push(...found.unfenced);
    for (const example of found.found) examples.push({ ...example, file });
  }
}

for (const [index, example] of examples.entries()) {
  const claims = [];
  const running = example.body.map((line, row) => {
    const found = line.match(CLAIM);
    if (found === null) return line;

    const literal = readLiteral(found.groups.claimed);
    if (literal === undefined) return line;

    const at = claims.length;
    claims.push({
      expected: show(literal.value),
      where: `${example.file}:${example.line + row}`,
    });

    return `${found.groups.indent}__claim(() => (${found.groups.expression}), ${at});`;
  });

  blocks.push({
    source: example.body.join('\n'),
    file: example.file,
    readme: example.file.endsWith('README.md'),
    line: example.line,
    run: claims.length > 0 ? path.join(scratch, `example${index}.run.mts`) : '',
    claims,
  });

  fs.writeFileSync(
    path.join(scratch, `example${index}.mts`),
    `${example.body.join('\n')}\n`
  );
  if (claims.length > 0) {
    fs.writeFileSync(
      path.join(scratch, `example${index}.run.mts`),
      `${PRELUDE}${running.join('\n')}\n`
    );
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
    const found = line.match(/^example(?<index>\d+)\.mts\((?<row>\d+),/);
    if (found === null) {
      failures.push(`  ${line}`);
      continue;
    }

    const block = blocks[Number(found.groups.index)];
    const where = block
      ? `${block.file}:${block.line + Number(found.groups.row) - 1}`
      : line;
    failures.push(`  ${where}\n      ${line.slice(line.indexOf(': ') + 2)}`);
  }
}

// An example is a few statements that run and finish. One that opens a server
// or sets an interval holds the event loop instead, and a synchronous run with
// no bound waits on it until the CI job's own limit ends the whole thing, with
// nothing said about which block was responsible. Ten seconds is far more than
// any example here takes and far less than that.
const EXAMPLE_TIMEOUT_MS = 10_000;

// Temporal is finished for ES2027, but a Node LTS line may not have it yet.
// An example that uses it is still compiled there, against TypeScript's own
// declarations, and its claims wait for a runtime that can check them, with
// the count said out loud rather than passed over.
const hasTemporal = typeof Temporal !== 'undefined';
const USES_TEMPORAL = /\bTemporal\./;
let waiting = 0;

for (const block of blocks) {
  if (block.run === '') continue;
  if (!hasTemporal && USES_TEMPORAL.test(block.source)) {
    waiting += 1;
    continue;
  }

  try {
    execFileSync(process.execPath, [block.run], {
      cwd: scratch,
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: EXAMPLE_TIMEOUT_MS,
      env: { ...process.env, README_CLAIMS: JSON.stringify(block.claims) },
    });
  } catch (error) {
    if (error.code === 'ETIMEDOUT') {
      failures.push(
        `  ${block.file}:${block.line}\n` +
          `      still running after ${EXAMPLE_TIMEOUT_MS / 1000} seconds; ` +
          'an example has to finish on its own'
      );
      continue;
    }

    failures.push(`  ${`${error.stderr ?? ''}`.trimEnd()}`);
  }
}

fs.rmSync(scratch, { recursive: true, force: true });

for (const where of unfenced) {
  failures.push(`  ${where}\n      @example holds no fenced \`ts\` block`);
}

const readmes = blocks.filter((block) => block.readme);
const comments = blocks.filter((block) => !block.readme);
const claimsIn = (list) =>
  list.reduce((total, block) => total + block.claims.length, 0);

// Finding nothing is a failure, not a pass. A fence that stopped matching --
// a renamed language tag, a line ending nobody expected -- would otherwise
// leave this reporting success over zero examples. Each source is held to it
// separately, so the doc comments going unread cannot hide behind the READMEs.
if (readmes.length === 0) {
  console.error('No `ts` examples found in any package README.');
  process.exit(1);
}
if (comments.length === 0) {
  console.error('No `ts` examples found in any doc comment `@example`.');
  process.exit(1);
}

if (failures.length > 0) {
  console.error(`The examples do not hold up:\n\n${failures.join('\n')}\n`);
  process.exit(1);
}

console.info(
  `Checked ${readmes.length} README examples and the ${claimsIn(readmes)} ` +
    `results they claim, and ${comments.length} doc comment examples and ` +
    `the ${claimsIn(comments)} results they claim.`
);
if (waiting > 0) {
  console.info(
    `${waiting} of them use Temporal, which this Node does not have, so ` +
      'they were compiled but their claims were not run.'
  );
}
