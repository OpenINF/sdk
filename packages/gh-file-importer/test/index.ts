// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join as pathJoin } from 'node:path';
import { afterEach, describe, it, mock } from 'node:test';

function freshRequire(id: string) {
  delete require.cache[require.resolve(id)];
  return require(id);
}

function mockOctokit(getContentImpl: (opts: unknown) => unknown) {
  const getContent = mock.fn(getContentImpl);
  const constructorCalls: unknown[] = [];
  class FakeOctokit {
    public repos = { getContent };
    public constructor(opts: unknown) {
      constructorCalls.push(opts);
    }
  }
  mock.module('@octokit/rest', {
    exports: { Octokit: FakeOctokit },
  });
  return { getContent, constructorCalls };
}

/**
 * Asserts Octokit was constructed exactly once and returns the options it
 * received, so a test can check the one key it cares about rather than
 * restating every option the constructor happens to pass.
 */
function soleOctokitOptions(calls: unknown[]): Record<string, unknown> {
  assert.strictEqual(calls.length, 1);
  return calls[0] as Record<string, unknown>;
}

function mockFetch(
  text: string,
  response: { ok?: boolean; status?: number; statusText?: string } = {}
): void {
  mock.method(globalThis, 'fetch', async () => ({
    ok: response.ok ?? true,
    status: response.status ?? 200,
    statusText: response.statusText ?? 'OK',
    text: async () => text,
  }));
}

describe('GhFileImporter', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('constructor', () => {
    it('should throw MissingOptionError when destDir is omitted', () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      assert.throws(() => new GhFileImporter({}), /destDir/);
    });

    it('should throw when destDir is not a string', () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      assert.throws(() => new GhFileImporter({ destDir: 123 }));
    });

    it('should throw when destDir is an empty string', () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      assert.throws(() => new GhFileImporter({ destDir: '' }));
    });

    it('should construct Octokit without auth when GITHUB_TOKEN is unset', () => {
      const { constructorCalls } = mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      const previous = process.env['GITHUB_TOKEN'];
      delete process.env['GITHUB_TOKEN'];
      try {
        new GhFileImporter({ destDir: '/tmp' });
        assert.ok(!('auth' in soleOctokitOptions(constructorCalls)));
      } finally {
        if (previous !== undefined) process.env['GITHUB_TOKEN'] = previous;
      }
    });

    it('should construct Octokit with auth from GITHUB_TOKEN when options.auth is omitted', () => {
      const { constructorCalls } = mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      const previous = process.env['GITHUB_TOKEN'];
      process.env['GITHUB_TOKEN'] = 'secret-token';
      try {
        new GhFileImporter({ destDir: '/tmp' });
        assert.strictEqual(
          soleOctokitOptions(constructorCalls)['auth'],
          'secret-token'
        );
      } finally {
        if (previous === undefined) {
          delete process.env['GITHUB_TOKEN'];
        } else {
          process.env['GITHUB_TOKEN'] = previous;
        }
      }
    });

    it('should prefer options.auth over GITHUB_TOKEN when both are set', () => {
      const { constructorCalls } = mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      const previous = process.env['GITHUB_TOKEN'];
      process.env['GITHUB_TOKEN'] = 'env-token';
      try {
        new GhFileImporter({ destDir: '/tmp', auth: 'explicit-token' });
        assert.strictEqual(
          soleOctokitOptions(constructorCalls)['auth'],
          'explicit-token'
        );
      } finally {
        if (previous === undefined) {
          delete process.env['GITHUB_TOKEN'];
        } else {
          process.env['GITHUB_TOKEN'] = previous;
        }
      }
    });

    it('should hand its logger to Octokit so request logging flows through it', () => {
      const { constructorCalls } = mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });
      assert.strictEqual(
        soleOctokitOptions(constructorCalls)['log'],
        importer.log
      );
    });

    it('should hand a caller-supplied logger to Octokit too', () => {
      const { constructorCalls } = mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      const custom = {
        trace: () => {},
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
        fatal: () => {},
      };
      const importer = new GhFileImporter({ destDir: '/tmp', log: custom });
      assert.strictEqual(importer.log, custom);
      assert.strictEqual(soleOctokitOptions(constructorCalls)['log'], custom);
    });

    it('should let options.log take precedence over options.logLevel', () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      const custom = {
        trace: () => {},
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
        fatal: () => {},
      };
      const importer = new GhFileImporter({
        destDir: '/tmp',
        logLevel: 'error',
        log: custom,
      });
      assert.strictEqual(importer.log, custom);
    });

    it('should throw when logLevel does not name a level', () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      assert.throws(
        () => new GhFileImporter({ destDir: '/tmp', logLevel: 'verbose' }),
        /logLevel/
      );
    });

    it('should allow options.auth to force unauthenticated requests even when GITHUB_TOKEN is set', () => {
      const { constructorCalls } = mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      const previous = process.env['GITHUB_TOKEN'];
      process.env['GITHUB_TOKEN'] = 'env-token';
      try {
        new GhFileImporter({ destDir: '/tmp', auth: '' });
        assert.ok(!('auth' in soleOctokitOptions(constructorCalls)));
      } finally {
        if (previous === undefined) {
          delete process.env['GITHUB_TOKEN'];
        } else {
          process.env['GITHUB_TOKEN'] = previous;
        }
      }
    });
  });

  describe('fetchContent', () => {
    it('should reject a non-string owner', async () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });
      await assert.rejects(() =>
        importer.fetchContent({ owner: 42, repo: 'repo' })
      );
    });

    it('should reject an empty repo', async () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });
      await assert.rejects(() =>
        importer.fetchContent({ owner: 'owner', repo: '' })
      );
    });

    it('should call Octokit with only owner/repo when path and ref are omitted', async () => {
      const { getContent } = mockOctokit(async () => ({ data: {} }));
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });

      await importer.fetchContent({ owner: 'octocat', repo: 'Hello-World' });

      assert.strictEqual(getContent.mock.callCount(), 1);
      assert.deepStrictEqual(getContent.mock.calls[0]?.arguments[0], {
        owner: 'octocat',
        repo: 'Hello-World',
      });
    });

    // Before logLevel existed the built-in logger was pinned to 'info', so
    // these two debug messages could never be emitted by any caller.
    it('should emit the omitted-path and omitted-ref debug messages at debug level', async () => {
      mockOctokit(async () => ({ data: {} }));
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({
        destDir: '/tmp',
        logLevel: 'debug',
      });

      const messages: string[] = [];
      mock.method(console, 'info', (...args: unknown[]) => {
        messages.push(String(args[0]));
      });

      await importer.fetchContent({ owner: 'octocat', repo: 'Hello-World' });

      assert.strictEqual(messages.length, 2);
      assert.match(messages[0] ?? '', /path/);
      assert.match(messages[0] ?? '', /root directory/);
      assert.match(messages[1] ?? '', /ref/);
      assert.match(messages[1] ?? '', /default branch/);
    });

    it('should stay silent about omitted path and ref at the default level', async () => {
      mockOctokit(async () => ({ data: {} }));
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });

      const messages: string[] = [];
      mock.method(console, 'info', (...args: unknown[]) => {
        messages.push(String(args[0]));
      });

      await importer.fetchContent({ owner: 'octocat', repo: 'Hello-World' });

      assert.deepStrictEqual(messages, []);
    });

    it('should pass path and ref through when provided', async () => {
      const { getContent } = mockOctokit(async () => ({ data: {} }));
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });

      await importer.fetchContent({
        owner: 'octocat',
        repo: 'Hello-World',
        path: 'README.md',
        ref: 'main',
      });

      assert.deepStrictEqual(getContent.mock.calls[0]?.arguments[0], {
        owner: 'octocat',
        repo: 'Hello-World',
        path: 'README.md',
        ref: 'main',
      });
    });

    it('should return a directory listing as-is', async () => {
      const listing = [{ type: 'file', name: 'README.md' }];
      mockOctokit(async () => ({ data: listing }));
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });

      const result = await importer.fetchContent({
        owner: 'octocat',
        repo: 'Hello-World',
      });

      assert.deepStrictEqual(result, listing);
    });
  });

  describe('isContentFile', () => {
    it('should return true for a file entry', () => {
      const { isContentFile } = freshRequire('../src/index');
      assert.strictEqual(isContentFile({ type: 'file' }), true);
    });

    it('should return false for a directory listing (array)', () => {
      const { isContentFile } = freshRequire('../src/index');
      assert.strictEqual(isContentFile([{ type: 'file' }]), false);
    });

    it('should return false for a symlink entry', () => {
      const { isContentFile } = freshRequire('../src/index');
      assert.strictEqual(isContentFile({ type: 'symlink' }), false);
    });

    it('should return false for a submodule entry', () => {
      const { isContentFile } = freshRequire('../src/index');
      assert.strictEqual(isContentFile({ type: 'submodule' }), false);
    });
  });

  describe('fetchFileText', () => {
    it('should reject a non-string path', async () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });
      await assert.rejects(() =>
        importer.fetchFileText({ owner: 'o', repo: 'r', path: 42 })
      );
    });

    it('should base64-decode the returned content', async () => {
      const encoded = Buffer.from('hello world', 'utf-8').toString('base64');
      mockOctokit(async () => ({
        data: { type: 'file', content: encoded, encoding: 'base64' },
      }));
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });

      const result = await importer.fetchFileText({
        owner: 'octocat',
        repo: 'Hello-World',
        path: 'README.md',
      });

      assert.strictEqual(result, 'hello world');
    });

    it('should throw when path resolves to a directory', async () => {
      mockOctokit(async () => ({
        data: [{ type: 'file', name: 'README.md' }],
      }));
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });

      await assert.rejects(
        () =>
          importer.fetchFileText({
            owner: 'octocat',
            repo: 'Hello-World',
            path: 'src',
          }),
        /did not resolve to a file/
      );
    });

    it('should throw when path resolves to a symlink', async () => {
      mockOctokit(async () => ({ data: { type: 'symlink' } }));
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });

      await assert.rejects(() =>
        importer.fetchFileText({
          owner: 'octocat',
          repo: 'Hello-World',
          path: 'some-symlink',
        })
      );
    });
  });

  describe('fetchUrlText', () => {
    it('should reject an empty url', async () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });
      await assert.rejects(() => importer.fetchUrlText(''));
    });

    it('should return the fetched body text', async () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      mockFetch('raw file contents');
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });

      const result = await importer.fetchUrlText(
        'https://raw.githubusercontent.com/octocat/Hello-World/main/README.md'
      );

      assert.strictEqual(result, 'raw file contents');
    });

    it('should reject a non-success HTTP response', async () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      mockFetch('not found', {
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp' });

      await assert.rejects(
        () => importer.fetchUrlText('https://example.com/missing.txt'),
        /HTTP 404 Not Found/
      );
    });
  });

  describe('importFile', () => {
    it('should write the fetched repo file to destDir, preserving nested paths', async () => {
      const encoded = Buffer.from('from octokit', 'utf-8').toString('base64');
      mockOctokit(async () => ({
        data: { type: 'file', content: encoded, encoding: 'base64' },
      }));
      const { GhFileImporter } = freshRequire('../src/index');

      const destDir = await mkdtemp(pathJoin(tmpdir(), 'gh-file-importer-'));
      try {
        const importer = new GhFileImporter({ destDir });
        const written = await importer.importFile({
          owner: 'octocat',
          repo: 'Hello-World',
          path: 'docs/README.md',
        });

        assert.strictEqual(written, pathJoin(destDir, 'docs', 'README.md'));
        const contents = await readFile(written, 'utf-8');
        assert.strictEqual(contents, 'from octokit');
      } finally {
        await rm(destDir, { recursive: true, force: true });
      }
    });

    it('should write to destPath when provided, instead of location.path', async () => {
      const encoded = Buffer.from('from octokit', 'utf-8').toString('base64');
      mockOctokit(async () => ({
        data: { type: 'file', content: encoded, encoding: 'base64' },
      }));
      const { GhFileImporter } = freshRequire('../src/index');

      const destDir = await mkdtemp(pathJoin(tmpdir(), 'gh-file-importer-'));
      try {
        const importer = new GhFileImporter({ destDir });
        const written = await importer.importFile(
          { owner: 'octocat', repo: 'Hello-World', path: 'docs/README.md' },
          'renamed.md'
        );

        assert.strictEqual(written, pathJoin(destDir, 'renamed.md'));
        const contents = await readFile(written, 'utf-8');
        assert.strictEqual(contents, 'from octokit');
      } finally {
        await rm(destDir, { recursive: true, force: true });
      }
    });
  });

  describe('importUrl', () => {
    it('should write the fetched URL contents to destDir, named from the URL', async () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      mockFetch('from url');
      const { GhFileImporter } = freshRequire('../src/index');

      const destDir = await mkdtemp(pathJoin(tmpdir(), 'gh-file-importer-'));
      try {
        const importer = new GhFileImporter({ destDir });
        const written = await importer.importUrl(
          'https://raw.githubusercontent.com/octocat/Hello-World/main/README.md'
        );

        assert.strictEqual(written, pathJoin(destDir, 'README.md'));
        const contents = await readFile(written, 'utf-8');
        assert.strictEqual(contents, 'from url');
      } finally {
        await rm(destDir, { recursive: true, force: true });
      }
    });

    it('should write to destPath when provided, instead of the URL basename', async () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      mockFetch('from url');
      const { GhFileImporter } = freshRequire('../src/index');

      const destDir = await mkdtemp(pathJoin(tmpdir(), 'gh-file-importer-'));
      try {
        const importer = new GhFileImporter({ destDir });
        const written = await importer.importUrl(
          'https://raw.githubusercontent.com/octocat/Hello-World/main/README.md',
          'nested/renamed.md'
        );

        assert.strictEqual(written, pathJoin(destDir, 'nested', 'renamed.md'));
        const contents = await readFile(written, 'utf-8');
        assert.strictEqual(contents, 'from url');
      } finally {
        await rm(destDir, { recursive: true, force: true });
      }
    });

    it('should ignore query and fragment text when deriving the filename', async () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      mockFetch('from url');
      const { GhFileImporter } = freshRequire('../src/index');

      const destDir = await mkdtemp(pathJoin(tmpdir(), 'gh-file-importer-'));
      try {
        const importer = new GhFileImporter({ destDir });
        const written = await importer.importUrl(
          'https://example.com/releases/archive.tgz?download=1#asset'
        );

        assert.strictEqual(written, pathJoin(destDir, 'archive.tgz'));
        assert.strictEqual(await readFile(written, 'utf-8'), 'from url');
      } finally {
        await rm(destDir, { recursive: true, force: true });
      }
    });
  });
});

describe('path traversal', () => {
  // This block is a sibling of the GhFileImporter suite, so it needs its own
  // reset; node:test refuses to mock a module that is already mocked.
  afterEach(() => {
    mock.reset();
  });

  const escapes = [
    ['../outside.txt', 'a relative escape'],
    ['../../../../etc/cron.d/evil', 'a deep relative escape'],
    ['/etc/passwd', 'an absolute path'],
    ['../safe-evil/pwn.txt', 'a sibling directory sharing the prefix'],
  ] as const;

  for (const [destPath, label] of escapes) {
    it(`should refuse ${label}`, async () => {
      mockOctokit(() => {
        throw new Error('should not be called');
      });
      mockFetch('payload');
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: '/tmp/safe' });

      await assert.rejects(
        () => importer.importUrl('https://example.com/x', destPath),
        /resolves outside/
      );
    });
  }

  it('should still allow a nested path inside destDir', async () => {
    mockOctokit(() => {
      throw new Error('should not be called');
    });
    mockFetch('payload');
    const { GhFileImporter } = freshRequire('../src/index');
    const dir = await mkdtemp(pathJoin(tmpdir(), 'ghfi-'));
    try {
      const importer = new GhFileImporter({ destDir: dir });
      const written = await importer.importUrl(
        'https://example.com/x',
        'a/b/ok.txt'
      );
      assert.ok(written.startsWith(dir));
      assert.strictEqual(await readFile(written, 'utf8'), 'payload');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('should refuse a parent-directory symlink that leaves destDir', async () => {
    mockOctokit(() => {
      throw new Error('should not be called');
    });
    mockFetch('payload');
    const dir = await mkdtemp(pathJoin(tmpdir(), 'ghfi-root-'));
    const outside = await mkdtemp(pathJoin(tmpdir(), 'ghfi-outside-'));
    try {
      await symlink(outside, pathJoin(dir, 'linked'));
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: dir });

      await assert.rejects(
        () => importer.importUrl('https://example.com/x', 'linked/escaped.txt'),
        /symbolic link resolves outside/
      );
      await assert.rejects(() => readFile(pathJoin(outside, 'escaped.txt')));
    } finally {
      await rm(dir, { recursive: true, force: true });
      await rm(outside, { recursive: true, force: true });
    }
  });

  it('should refuse a final-component symlink', async () => {
    mockOctokit(() => {
      throw new Error('should not be called');
    });
    mockFetch('replacement');
    const dir = await mkdtemp(pathJoin(tmpdir(), 'ghfi-root-'));
    const outsideDir = await mkdtemp(pathJoin(tmpdir(), 'ghfi-outside-'));
    const outside = pathJoin(outsideDir, 'target.txt');
    try {
      await writeFile(outside, 'original');
      await symlink(outside, pathJoin(dir, 'linked.txt'));
      const { GhFileImporter } = freshRequire('../src/index');
      const importer = new GhFileImporter({ destDir: dir });

      await assert.rejects(() =>
        importer.importUrl('https://example.com/x', 'linked.txt')
      );
      assert.strictEqual(await readFile(outside, 'utf8'), 'original');
    } finally {
      await rm(dir, { recursive: true, force: true });
      await rm(outsideDir, { recursive: true, force: true });
    }
  });
});
