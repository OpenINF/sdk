#!/usr/bin/env node

// Normalizes the package-invariant metadata (repository, bugs, files,
// engines, author, license, types, exports) that every publishable
// workspace package under packages/* should share, rewriting each
// package.json from a single canonical definition instead of by
// hand-copying between packages.
//
// Run: node tools/sync-package-metadata.js

'use strict';

const fs = require('fs');
const path = require('path');

const PACKAGES_DIR = path.join(__dirname, '..', 'packages');
const REPO_URL = 'https://github.com/OpenINF/sdk.git';
const ISSUES_URL = 'https://github.com/OpenINF/sdk/issues';
const AUTHOR = 'The OpenINF Authors';
const LICENSE = 'MIT';
// The oldest Node.js release line still inside an LTS window. OpenINF supports
// LTS lines only: once a line reaches end of life it leaves this range, rather
// than lingering as best-effort. 22.11.0 is where the Jod line actually entered
// LTS, so it is the first 22.x a consumer can be on and still be supported;
// Iron (20.x) reached end of life on 2026-04-30 and the previous `>=20.19.0`
// floor has admitted an unsupported line since.
//
// Moves next on 2027-04-30, when Jod reaches end of life and the floor becomes
// 24.11.0. See <https://nodejs.org/en/about/previous-releases>.
const ENGINES = { node: '>=22.11.0' };

// Field order every synced package.json is rewritten to follow.
const FIELD_ORDER = [
  'name',
  'version',
  'description',
  'main',
  'types',
  'exports',
  'sideEffects',
  'scripts',
  'repository',
  'bugs',
  'keywords',
  'files',
  'engines',
  'author',
  'license',
  'publishConfig',
  'dependencies',
  'devDependencies',
];

function typesFromMain(main) {
  return main.replace(/^(\.\/)?/, './').replace(/\.js$/, '.d.ts');
}

// The ESM build output is finalized (see tools/finalize-esm-output.js)
// to the .mjs/.d.mts extensions, which Node/TypeScript treat as
// unambiguously ESM regardless of the nearest package.json "type".
function exportsFromMain(main) {
  const cjsIndex = main.replace(/^(\.\/)?/, './');
  const cjsTypes = typesFromMain(cjsIndex);
  const esmIndex = cjsIndex.replace('/cjs/', '/esm/').replace(/\.js$/, '.mjs');
  const esmTypes = cjsTypes
    .replace('/cjs/', '/esm/')
    .replace(/\.d\.ts$/, '.d.mts');

  return {
    '.': {
      import: { types: esmTypes, default: esmIndex },
      require: { types: cjsTypes, default: cjsIndex },
    },
    './package.json': './package.json',
  };
}

function syncOne(dirName) {
  const pkgPath = path.join(PACKAGES_DIR, dirName, 'package.json');
  if (!fs.existsSync(pkgPath)) return null; // stub package, nothing to sync yet

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  if (pkg.main) {
    pkg.main = pkg.main.replace(/^(\.\/)?/, './');
    if (!pkg.types) pkg.types = typesFromMain(pkg.main);
    pkg.exports = exportsFromMain(pkg.main);
  }

  // Every packages/*/src module was audited (2026-08-01) for top-level
  // statements a bundler would have to evaluate on import. All of them are
  // module-local: `guard.expectation = '...'` assignments onto a function
  // declared in the same module, regex/string-literal constants, and the
  // `Object.setPrototypeOf(NodeTypeError.prototype, TypeError.prototype)`
  // wiring in util-errors/src/abstractions (whose target is module-local and
  // whose source is only read). Nothing mutates a global, patches a builtin
  // prototype, or does I/O at import time, so dropping an unused module is
  // always safe. If a package ever gains a real import-time side effect
  // (a polyfill, a global registration), give it an explicit file-glob array
  // here instead of letting this flatten it to false.
  pkg.sideEffects = false;

  pkg.repository = {
    type: 'git',
    url: REPO_URL,
    directory: `packages/${dirName}`,
  };
  pkg.bugs = { url: ISSUES_URL };
  // npm always ships package.json/README/LICENSE regardless of `files`, but
  // not CHANGELOG.md -- list it so release notes land in consumers'
  // node_modules alongside the code. `src` ships because the generated
  // sourcemaps reference it (`"sources": ["../../src/index.ts"]`); without it
  // every published map dangles and debuggers can't show original TypeScript.
  pkg.files = ['dist', 'src', 'CHANGELOG.md'];
  pkg.engines = ENGINES;
  pkg.author = pkg.author || AUTHOR;
  pkg.license = pkg.license || LICENSE;

  // Scoped packages default to `restricted` on npm, which fails the very
  // first publish of each package. Declaring it here rather than passing
  // `--access public` keeps it true regardless of which tool does the
  // publishing.
  pkg.publishConfig = { access: 'public' };

  const ordered = {};
  for (const key of FIELD_ORDER) {
    if (key in pkg) ordered[key] = pkg[key];
  }
  for (const key of Object.keys(pkg)) {
    if (!(key in ordered)) ordered[key] = pkg[key];
  }

  fs.writeFileSync(pkgPath, JSON.stringify(ordered, null, 2) + '\n');
  return dirName;
}

const synced = fs.readdirSync(PACKAGES_DIR).sort().map(syncOne).filter(Boolean);

console.log(
  `Synced metadata for ${synced.length} package(s): ${synced.join(', ')}`
);
