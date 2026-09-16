/**
 * @file Load every package's ESM build, and hold it to what CommonJS exports.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} tools/check-esm-entrypoints
 */

// Every package ships two builds, and until now only one of them ran. The
// tests import TypeScript sources compiled for CommonJS, and `lint:packages`
// checks that `dist/esm` resolves for each kind of consumer, with publint and
// arethetypeswrong, but resolving is not loading: a build that throws on
// import, or that lost an export on its way through the ESM step, would pass
// both and reach npm.
//
// So this imports each package's ESM entry point, the file its `exports` map
// names for `import`, and compares what it exports with what `require` of the
// same package returns. The two builds come from one source, so they should
// agree exactly.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

/** The entry points of one package, as its `package.json` names them. */
interface Manifest {
  name: string;
  main?: string;
  exports?: { '.'?: { import?: { default?: string } } };
}

const failures: string[] = [];
let checked = 0;

const directories = fs
  .readdirSync(path.join(ROOT, 'packages'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(ROOT, 'packages', entry.name));

for (const directory of directories) {
  const manifest = require(path.join(directory, 'package.json')) as Manifest;
  const esmPath = manifest.exports?.['.']?.import?.default;

  if (manifest.main === undefined || esmPath === undefined) {
    failures.push(
      `${manifest.name} declares no CommonJS main or no ESM import entry point`
    );
    continue;
  }

  const esmFile = path.join(directory, esmPath);
  const cjsFile = path.join(directory, manifest.main);

  if (!fs.existsSync(esmFile) || !fs.existsSync(cjsFile)) {
    process.stderr.write(
      `${manifest.name} is not built; run \`pnpm run build\` first.\n`
    );
    process.exit(1);
  }

  let namespace: Record<string, unknown>;

  try {
    namespace = (await import(pathToFileURL(esmFile).href)) as Record<
      string,
      unknown
    >;
  } catch (error) {
    failures.push(
      `${manifest.name} failed to import its ESM build: ${String(error)}`
    );
    continue;
  }

  const fromEsm = new Set(
    Object.keys(namespace).filter((name) => name !== 'default')
  );
  const fromCjs = new Set(
    Object.keys(require(cjsFile) as Record<string, unknown>)
  );

  if (fromEsm.size === 0) {
    failures.push(`${manifest.name} exports nothing from its ESM build`);
    continue;
  }

  const missing = [...fromCjs].filter((name) => !fromEsm.has(name)).sort();
  const extra = [...fromEsm].filter((name) => !fromCjs.has(name)).sort();

  if (missing.length > 0) {
    failures.push(
      `${manifest.name} is missing from its ESM build: ${missing.join(', ')}`
    );
  }
  if (extra.length > 0) {
    failures.push(
      `${manifest.name} exports from its ESM build only: ${extra.join(', ')}`
    );
  }

  checked += 1;
}

if (failures.length > 0) {
  process.stderr.write(`${failures.join('\n')}\n`);
  process.exit(1);
}

process.stdout.write(
  `${checked} ESM builds load, each exporting what CommonJS does.\n`
);
