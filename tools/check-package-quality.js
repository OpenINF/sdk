#!/usr/bin/env node
// Checks every workspace package's published shape.
//
// Two things are verified, both against a real `pnpm pack` tarball rather than
// the working tree, because what matters is the artifact consumers install:
//
//   publint          -- the `exports` map, `main`/`types`, file presence, and
//                       CJS/ESM format agreement.
//   arethetypeswrong -- that the type declarations actually resolve under
//                       node10, node16 (from CJS), node16 (from ESM), and
//                       bundler. A dual-format package can look fine and still
//                       hand a CJS consumer ESM-only types.
//
// Run from the repo root: `pnpm run lint:packages`.
'use strict';

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PACKAGES = path.join(ROOT, 'packages');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pkg-quality-'));
const failures = [];

function run(cmd, args, cwd) {
  try {
    return {
      ok: true,
      out: execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: 'pipe' }),
    };
  } catch (error) {
    return {
      ok: false,
      out: `${error.stdout ?? ''}${error.stderr ?? ''}`,
    };
  }
}

const dirs = fs
  .readdirSync(PACKAGES, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => path.join(PACKAGES, e.name));

for (const dir of dirs) {
  const name = require(path.join(dir, 'package.json')).name;
  process.stdout.write(`${name}\n`);

  const publint = run('pnpm', ['exec', 'publint', '--strict'], dir);
  if (publint.ok) {
    process.stdout.write('  publint           ok\n');
  } else {
    process.stdout.write('  publint           FAILED\n');
    failures.push(`${name} (publint)\n${publint.out}`);
  }

  // attw needs a tarball; pack into a scratch dir so nothing lands in the tree.
  const packed = run('pnpm', ['pack', '--pack-destination', tmp], dir);
  if (!packed.ok) {
    process.stdout.write('  pack              FAILED\n');
    failures.push(`${name} (pack)\n${packed.out}`);
    continue;
  }

  const tarball = packed.out.trim().split('\n').pop().trim();
  const attw = run('pnpm', ['exec', 'attw', '--pack', tarball], ROOT);
  if (attw.ok) {
    process.stdout.write('  arethetypeswrong  ok\n');
  } else {
    process.stdout.write('  arethetypeswrong  FAILED\n');
    failures.push(`${name} (arethetypeswrong)\n${attw.out}`);
  }
}

fs.rmSync(tmp, { recursive: true, force: true });

if (failures.length > 0) {
  process.stdout.write(`\n${'-'.repeat(72)}\n`);
  for (const f of failures) process.stdout.write(`\n${f}\n`);
  process.stdout.write(`\n${failures.length} check(s) failed.\n`);
  process.exit(1);
}

process.stdout.write(`\nAll ${dirs.length} packages passed.\n`);
