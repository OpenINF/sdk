/**
 * @file Install every package from its tarball, as a consumer would, and use it.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} tools/check-installed-packages
 */

// Everything else that runs in CI reads the packages where they sit in the
// workspace. The tests import their sources, `test:esm` loads `dist/` in
// place, `lint:examples` links each package directory into a scratch
// `node_modules`, and `lint:packages` packs a tarball only to have publint and
// arethetypeswrong read it. Inside the workspace every package can see every
// other, and every file is on disk whether or not `files` names it.
//
// A consumer gets none of that. They get the tarball `pnpm pack` writes, with
// `workspace:*` rewritten to a version, installed into a `node_modules` that
// holds only what each package declares. A build output left out of `files`,
// a dependency used but never declared, or a declaration file that imports
// something it cannot reach would all pass every other check and fail the
// first `npm install`.
//
// So this packs every package, installs all the tarballs into an empty
// project with pnpm's isolated layout, which lets a package resolve only what
// it declares, and from that project:
//
//   require  -- loads each package through its `exports` map from CommonJS;
//   import   -- loads it from ESM, and holds it to what `require` returned;
//   types    -- compiles a CommonJS and an ESM consumer that import every
//               package, under `nodenext`, with no `skipLibCheck`.
//
// Loading runs on the Node.js running this script, so CI runs it again on
// the oldest release `engines.node` admits. The install reaches the registry
// for third-party dependencies, which is what a consumer's install does too.
//
// Run from the repo root, after `pnpm run build`: `pnpm run test:installed`.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

/** The parts of a package's `package.json` this reads. */
interface Manifest {
  name: string;
  private?: boolean;
}

const failures: string[] = [];

/** Runs a command, and returns its output or records why it failed. */
function run(
  label: string,
  command: string,
  args: string[],
  cwd: string
): string | undefined {
  try {
    return execFileSync(command, args, {
      cwd,
      encoding: 'utf8',
      stdio: 'pipe',
    });
  } catch (error) {
    const { stdout, stderr } = error as { stdout?: string; stderr?: string };
    failures.push(`${label}\n${stdout ?? ''}${stderr ?? ''}`.trimEnd());
    return undefined;
  }
}

function finish(): never {
  fs.rmSync(scratch, { recursive: true, force: true });
  if (failures.length > 0) {
    process.stderr.write(`${failures.join('\n\n')}\n`);
    process.exit(1);
  }
  process.exit(0);
}

const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'installed-packages-'));
const tarballs = path.join(scratch, 'tarballs');
const consumer = path.join(scratch, 'consumer');
fs.mkdirSync(tarballs);
fs.mkdirSync(consumer);

const packages = new Map<string, string>();

for (const entry of fs.readdirSync(path.join(ROOT, 'packages'), {
  withFileTypes: true,
})) {
  if (!entry.isDirectory()) continue;

  const directory = path.join(ROOT, 'packages', entry.name);
  const manifest = require(path.join(directory, 'package.json')) as Manifest;
  if (manifest.private === true) continue;

  if (!fs.existsSync(path.join(directory, 'dist'))) {
    process.stderr.write(
      `${manifest.name} is not built; run \`pnpm run build\` first.\n`
    );
    process.exit(1);
  }

  const packed = run(
    `${manifest.name} failed to pack`,
    'pnpm',
    // The workspace's `devEngines.runtime` refuses an older Node.js for
    // working on the repository; packing on one is what this is for.
    ['pack', '--config.runtime-on-fail=ignore', '--pack-destination', tarballs],
    directory
  );
  if (packed === undefined) continue;

  packages.set(manifest.name, packed.trim().split('\n').pop()!.trim());
}

if (failures.length > 0) finish();

// Every `@openinf` dependency, direct or transitive, comes from these
// tarballs. Without the overrides a package depending on another would fetch
// that one from the registry, and test what is already published instead.
const local = Object.fromEntries(
  [...packages].map(([name, tarball]) => [name, `file:${tarball}`])
);
const rootManifest = require(path.join(ROOT, 'package.json')) as {
  devDependencies: Record<string, string>;
};

fs.writeFileSync(
  path.join(consumer, 'package.json'),
  `${JSON.stringify(
    {
      name: 'consumer',
      private: true,
      dependencies: {
        ...local,
        // The README asks TypeScript consumers for Node's types, since the
        // declarations name Node's own.
        '@types/node': rootManifest.devDependencies['@types/node'],
      },
    },
    null,
    2
  )}\n`
);
// pnpm's isolated layout links each package only to what it declares, which
// is what makes a missing declaration fail here. Two things would undo that:
// hoisting, which pnpm does by default into `node_modules/.pnpm/node_modules`,
// and the consumer's own `node_modules`, which sits above `.pnpm` and holds
// every package, so Node.js would find an undeclared one there by walking up.
// Hoisting is turned off, and the packages' real directories are moved out
// from under the consumer.
fs.writeFileSync(
  path.join(consumer, 'pnpm-workspace.yaml'),
  `nodeLinker: isolated\nhoist: false\npublicHoistPattern: []\nvirtualStoreDir: ../virtual-store\noverrides:\n${Object.entries(
    local
  )
    .map(([name, spec]) => `  '${name}': '${spec}'\n`)
    .join('')}`
);

if (
  run(
    'Installing the tarballs failed',
    'pnpm',
    ['install', '--ignore-scripts'],
    consumer
  ) === undefined
) {
  finish();
}

const names = [...packages.keys()].sort();

// Each package is loaded twice, through the `require` and the `import`
// conditions of its `exports` map, and the two are held to the same names.
fs.writeFileSync(
  path.join(consumer, 'load.mjs'),
  `import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const failures = [];
for (const name of ${JSON.stringify(names)}) {
  let fromCjs;
  let fromEsm;
  try {
    fromCjs = Object.keys(require(name)).sort();
  } catch (error) {
    failures.push(name + ' failed to require: ' + String(error));
    continue;
  }
  try {
    fromEsm = Object.keys(await import(name)).filter((key) => key !== 'default').sort();
  } catch (error) {
    failures.push(name + ' failed to import: ' + String(error));
    continue;
  }
  if (fromCjs.length === 0) failures.push(name + ' exports nothing');
  const missing = fromCjs.filter((key) => !fromEsm.includes(key));
  const extra = fromEsm.filter((key) => !fromCjs.includes(key));
  if (missing.length > 0) failures.push(name + ' is missing from ESM: ' + missing.join(', '));
  if (extra.length > 0) failures.push(name + ' exports from ESM only: ' + extra.join(', '));
}
if (failures.length > 0) {
  console.error(failures.join('\\n'));
  process.exitCode = 1;
}
`
);

run(
  `Loading the installed packages on Node.js ${process.version} failed`,
  process.execPath,
  ['load.mjs'],
  consumer
);

// The declarations are compiled as a consumer's own code would see them:
// one file of each module kind, each importing every package. `skipLibCheck`
// stays off, so an error inside a shipped `.d.ts` counts, and the settings are
// the ones the root README asks a TypeScript consumer for and no more, so
// a declaration that needs anything else fails here rather than for them.
const imports = names
  .map((name, index) => `import * as package${index} from '${name}';\n`)
  .join('');
const uses = `export const loaded = [${names
  .map((_, index) => `package${index}`)
  .join(', ')}];\n`;

fs.writeFileSync(path.join(consumer, 'consumer.cts'), imports + uses);
fs.writeFileSync(path.join(consumer, 'consumer.mts'), imports + uses);
fs.writeFileSync(
  path.join(consumer, 'tsconfig.json'),
  `${JSON.stringify(
    {
      compilerOptions: {
        module: 'nodenext',
        moduleResolution: 'nodenext',
        target: 'es2022',
        lib: ['es2022', 'esnext.temporal'],
        strict: true,
        noEmit: true,
        skipLibCheck: false,
        types: ['node'],
      },
      files: ['consumer.cts', 'consumer.mts'],
    },
    null,
    2
  )}\n`
);

// The repository's compiler, run by whichever Node.js is on the PATH.
run(
  'Compiling against the installed declarations failed',
  path.join(ROOT, 'node_modules', '.bin', 'tsc'),
  ['-p', '.'],
  consumer
);

if (failures.length === 0) {
  process.stdout.write(
    `${names.length} packages install from their tarballs, load from CommonJS and ESM on Node.js ${process.version}, and type-check as a consumer sees them.\n`
  );
}

finish();
