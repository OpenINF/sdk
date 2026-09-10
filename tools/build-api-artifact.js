#!/usr/bin/env node
// Packages the generated API Markdown as a versioned artifact for the OpenINF
// portal.
//
// The portal publishes this reference at /docs/sdk/<version>/api/ and keeps
// every release it has been given, so what it imports has to say which release
// it describes and which commit produced it. A directory of Markdown cannot
// say that by itself, which is what the manifest beside it is for.
//
// The layout is the one the portal's importer reads, one directory per
// release:
//
//   <out>/<version>/manifest.json
//   <out>/<version>/docs/README.md
//   <out>/<version>/docs/navigation.json
//   <out>/<version>/docs/@openinf/<package>/...
//
// The version is not a label chosen here. All ten packages share one version
// -- Changesets `fixed` mode -- so the workspace already knows what release
// the documentation belongs to, and this reads it rather than being told. It
// refuses to guess when the packages disagree, which is what a workspace looks
// like before `changeset version` has run. Pass --version to package a corpus
// anyway; the release supplies no such flag, so a released artifact can only
// ever carry the version that was released.
//
// Run from the repo root, after `pnpm run docs:build`: `pnpm run docs:artifact`.

'use strict';

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(ROOT, 'docs', 'api');
const PACKAGES = path.join(ROOT, 'packages');
const CHECK = path.join(__dirname, 'check-api-docs.js');

// The shape the portal validates the manifest against. Failing here rather
// than there keeps a malformed artifact from being published at all.
const SCHEMA_VERSION = 1;
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const COMMIT = /^[0-9a-f]{7,64}$/;

/** Reads one `--flag value` pair out of the command line. */
function flag(name) {
  const at = process.argv.indexOf(`--${name}`);
  return at === -1 ? undefined : process.argv[at + 1];
}

/** Stops with a sentence rather than a stack trace. */
function fatal(message) {
  console.error(message);
  process.exit(1);
}

/**
 * The one version every package in the workspace is at. Changesets keeps them
 * in step, so a disagreement means the release has not been versioned yet.
 */
function workspaceVersion() {
  const versions = new Map();

  for (const entry of fs.readdirSync(PACKAGES, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const manifest = path.join(PACKAGES, entry.name, 'package.json');
    if (!fs.existsSync(manifest)) continue;

    const { name, version } = JSON.parse(fs.readFileSync(manifest, 'utf8'));
    versions.set(version, [...(versions.get(version) ?? []), name]);
  }

  if (versions.size === 1) return [...versions.keys()][0];

  const listed = [...versions]
    .map(([version, names]) => `  ${version}  ${names.sort().join(', ')}`)
    .join('\n');

  fatal(
    'The workspace packages are at different versions, so there is no ' +
      'release for this documentation to describe:\n\n' +
      `${listed}\n\n` +
      'Run `pnpm run version-packages` first, or pass --version to package ' +
      'a corpus that is not a release.'
  );
}

/** The commit the documentation was generated from. */
function currentCommit() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;

  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
  } catch {
    return fatal(
      'Could not read the current commit. Pass --commit, or set GITHUB_SHA.'
    );
  }
}

if (!fs.existsSync(DOCS)) {
  fatal('No API docs found. Run `pnpm run docs:build` first.');
}

// The portal refuses a corpus it cannot map onto its own URLs, and refuses it
// after the release that produced it has shipped. Checking here means an
// artifact is only ever built out of documentation that will import.
try {
  execFileSync(process.execPath, [CHECK], { cwd: ROOT, stdio: 'inherit' });
} catch {
  process.exit(1);
}

const version = flag('version') ?? workspaceVersion();
const commit = flag('commit') ?? currentCommit();
const out = path.resolve(ROOT, flag('out') ?? path.join('docs', 'artifact'));

if (!VERSION.test(version)) {
  fatal(`The portal will not accept ${version} as a release version.`);
}
if (!COMMIT.test(commit)) {
  fatal(`The portal will not accept ${commit} as a commit.`);
}

const directory = path.join(out, version);

fs.rmSync(directory, { recursive: true, force: true });
fs.mkdirSync(directory, { recursive: true });
fs.cpSync(DOCS, path.join(directory, 'docs'), { recursive: true });

const manifest = {
  schemaVersion: SCHEMA_VERSION,
  version,
  commit,
  generatedAt: new Date().toISOString(),
  docsPath: 'docs',
  navigationPath: 'docs/navigation.json',
};

fs.writeFileSync(
  path.join(directory, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`
);

const pages = fs
  .readdirSync(path.join(directory, 'docs'), {
    recursive: true,
    withFileTypes: true,
  })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md')).length;

const where = path.relative(process.cwd(), directory);

console.info(
  `Packaged ${pages} pages as the ${version} API artifact in ` +
    `${where.startsWith('..') ? directory : where}/, from commit ` +
    `${commit.slice(0, 7)}.`
);
