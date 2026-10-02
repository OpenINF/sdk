/**
 * @file Tests for the publishing script's contract with the release action.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} tools/release-contract.test
 */
import {
  deepStrictEqual,
  doesNotMatch,
  match,
  strictEqual,
} from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, test, type TestContext } from 'node:test';
import { fileURLToPath } from 'node:url';

import { validateCommitMessage } from '../build/shared/commit-message.mts';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifest = JSON.parse(
  readFileSync(join(root, 'package.json'), 'utf8')
) as {
  scripts: { release: string };
};
const changesetCli = resolve(root, 'node_modules/@changesets/cli/bin.js');

function fixture(t: TestContext) {
  const cwd = mkdtempSync(join(tmpdir(), 'sdk-release-contract-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const bin = join(cwd, 'bin');
  mkdirSync(bin);
  mkdirSync(join(cwd, '.changeset'));
  mkdirSync(join(cwd, 'packages/example'), { recursive: true });
  writeFileSync(
    join(cwd, 'package.json'),
    JSON.stringify({ name: 'release-fixture', private: true })
  );
  writeFileSync(
    join(cwd, 'pnpm-workspace.yaml'),
    'packages:\n  - packages/*\n'
  );
  writeFileSync(
    join(cwd, 'packages/example/package.json'),
    JSON.stringify({ name: '@example/sdk', version: '3.0.0' })
  );
  writeFileSync(join(cwd, '.changeset/config.json'), '{}');

  // Replace only the publisher: the real Changesets CLI creates the tags and
  // output report, but nothing in these tests contacts a package registry.
  writeFileSync(
    join(bin, 'pnpm'),
    '#!/bin/sh\nprintf "%s\\n" "$@" > "$PUBLISH_ARGS"\nexit "${PUBLISH_EXIT:-0}"\n'
  );
  writeFileSync(
    join(bin, 'changeset'),
    '#!/bin/sh\nexec "$NODE_BINARY" "$CHANGESET_CLI" "$@"\n'
  );
  chmodSync(join(bin, 'pnpm'), 0o755);
  chmodSync(join(bin, 'changeset'), 0o755);

  const git = (...args: string[]) =>
    execFileSync('git', args, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();
  git('init', '--initial-branch=main');
  git('config', 'user.name', 'Release Test');
  git('config', 'user.email', 'release-test@example.com');
  git('add', 'package.json', 'pnpm-workspace.yaml', '.changeset', 'packages');
  git('commit', '-m', 'fixture');
  const output = join(cwd, 'changesets-output.ndjson');
  const argsPath = join(cwd, 'publish-args');
  const run = (exitCode = 0) => {
    // The action gives every invocation a new report path.
    rmSync(output, { force: true });
    return spawnSync('sh', ['-c', manifest.scripts.release], {
      cwd,
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH ?? ''}`,
        NODE_BINARY: process.execPath,
        CHANGESET_CLI: changesetCli,
        CHANGESETS_OUTPUT: output,
        PUBLISH_ARGS: argsPath,
        PUBLISH_EXIT: String(exitCode),
      },
    });
  };
  return { git, output, argsPath, run };
}

describe('release output contract', () => {
  test('tags and reports published versions after pnpm succeeds', (t) => {
    const { git, output, argsPath, run } = fixture(t);
    const result = run();
    strictEqual(result.status, 0, result.stderr + result.stdout);
    deepStrictEqual(readFileSync(argsPath, 'utf8').trim().split('\n'), [
      '-r',
      'publish',
      '--no-git-checks',
      '--provenance',
    ]);
    const events: unknown[] = readFileSync(output, 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as unknown);
    deepStrictEqual(events, [
      {
        type: 'git-tag',
        tag: '@example/sdk@3.0.0',
        packageName: '@example/sdk',
      },
    ]);
    strictEqual(git('cat-file', '-t', '@example/sdk@3.0.0'), 'tag');
    strictEqual(
      git('rev-parse', '@example/sdk@3.0.0^{}'),
      git('rev-parse', 'HEAD')
    );
  });

  test('does not tag or report a failed publish', (t) => {
    const { git, output, run } = fixture(t);
    const result = run(23);
    strictEqual(result.status, 23);
    strictEqual(git('tag', '--list'), '');
    strictEqual(existsSync(output), false);
  });

  test('can recover after failure and reports no duplicate tags on retry', (t) => {
    const { git, output, run } = fixture(t);
    strictEqual(run(23).status, 23);
    const recovered = run();
    strictEqual(recovered.status, 0, recovered.stderr + recovered.stdout);
    strictEqual(git('tag', '--list'), '@example/sdk@3.0.0');
    const repeated = run();
    strictEqual(repeated.status, 0, repeated.stderr + repeated.stdout);
    strictEqual(readFileSync(output, 'utf8'), '');
  });
});

test('the generated release PR and commit satisfy repository policy', () => {
  const workflow = readFileSync(
    join(root, '.github/workflows/release.yml'),
    'utf8'
  );
  for (const input of ['commit-message', 'pr-title']) {
    const match = new RegExp(`^\\s+${input}: '([^']+)'$`, 'm').exec(workflow);
    strictEqual(typeof match?.[1], 'string', `missing ${input}`);
    deepStrictEqual(validateCommitMessage(match?.[1] ?? ''), []);
  }
});

test('publish-mode recovery does not depend on newly published output', () => {
  const workflow = readFileSync(
    join(root, '.github/workflows/release.yml'),
    'utf8'
  );
  const recoverableSteps = [
    'node tools/reconcile-github-releases.mts',
    'pnpm run docs:build',
    'pnpm run docs:artifact',
    'actions/upload-artifact@',
  ];
  for (const step of recoverableSteps) {
    const position = workflow.indexOf(step);
    strictEqual(position >= 0, true, `missing ${step}`);
    const prefix = workflow.slice(Math.max(0, position - 180), position);
    match(prefix, /outputs\.has-changesets == 'false'/);
    doesNotMatch(prefix, /outputs\.published == 'true'/);
  }
});
