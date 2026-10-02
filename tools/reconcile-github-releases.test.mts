/**
 * @file Tests for recovery after a partially completed GitHub release.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} tools/reconcile-github-releases.test
 */
import { deepStrictEqual, rejects, strictEqual } from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  changelogEntry,
  reconcileRelease,
} from './reconcile-github-releases.mts';

const release = {
  tag: '@openinf/util-core@3.0.0',
  name: '@openinf/util-core@3.0.0',
  body: 'Fixed the release.',
  prerelease: false,
};

describe(reconcileRelease.name, () => {
  test('creates a missing release for an existing tag', async () => {
    const calls: { path: string; init?: RequestInit }[] = [];
    const result = await reconcileRelease(
      release,
      async (requestPath, init) => {
        calls.push({
          path: requestPath,
          ...(init === undefined ? {} : { init }),
        });
        if (requestPath.startsWith('/git/ref/')) {
          return Response.json({ ref: release.tag });
        }
        if (requestPath.startsWith('/releases/tags/')) {
          return Response.json({ message: 'Not Found' }, { status: 404 });
        }
        return Response.json({ id: 1 }, { status: 201 });
      }
    );

    strictEqual(result, 'created');
    strictEqual(calls.length, 3);
    strictEqual(calls[2]?.path, '/releases');
    deepStrictEqual(JSON.parse(String(calls[2]?.init?.body)), {
      tag_name: release.tag,
      name: release.name,
      body: release.body,
      prerelease: false,
    });
  });

  test('leaves an existing release unchanged', async () => {
    const paths: string[] = [];
    const result = await reconcileRelease(release, async (requestPath) => {
      paths.push(requestPath);
      return Response.json({ id: 1 });
    });

    strictEqual(result, 'exists');
    strictEqual(paths.length, 2);
  });

  test('does not create a release when its tag is absent', async () => {
    let calls = 0;
    await rejects(
      () =>
        reconcileRelease(release, async () => {
          calls += 1;
          return Response.json({ message: 'Not Found' }, { status: 404 });
        }),
      /Reading tag.*404/
    );
    strictEqual(calls, 1);
  });
});

test('extracts exactly one version from a Changesets changelog', () => {
  const changelog = `# @openinf/util-core

## 3.1.0

Newer entry.

## 3.0.0

Release candidate fixes.
`;
  strictEqual(changelogEntry(changelog, '3.1.0'), 'Newer entry.');
  strictEqual(changelogEntry(changelog, '3.0.0'), 'Release candidate fixes.');
});
