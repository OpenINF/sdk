// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import { GhFileImporter } from '../src/index';

const location = {
  owner: 'octocat',
  repo: 'private-repo',
  path: 'docs/large file.txt',
  ref: '8177c457583d9ad009d65fec7ca162bfefd12ab5',
};

function fileMetadata(size: number): Response {
  return Response.json({
    type: 'file',
    encoding: 'none',
    content: '',
    size,
    download_url: 'https://example.invalid/unauthenticated-download',
  });
}

describe('large repository files', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should fetch omitted contents with the same authentication, path, and ref', async () => {
    const text = `\uFEFF${'x'.repeat(1024 * 1024)}\r\n\u{1F9EA}\0end`;
    const bytes = Buffer.from(text, 'utf-8');
    const requestedLocation = { ...location };
    const requests: { url: URL; headers: Headers }[] = [];
    mock.method(
      globalThis,
      'fetch',
      async (input: string | URL | Request, init?: RequestInit) => {
        const url = new URL(String(input));
        const headers = new Headers(init?.headers);
        requests.push({ url, headers });
        if (requests.length === 1) {
          requestedLocation.ref = 'another-branch';
          return fileMetadata(bytes.length);
        }
        assert.strictEqual(requests.length, 2);
        return new Response(bytes, {
          headers: { 'content-type': 'application/vnd.github.raw+json' },
        });
      }
    );
    const importer = new GhFileImporter({
      destDir: '/tmp',
      auth: 'private-test-token',
    });

    const actual = await importer.fetchFileText(requestedLocation);

    assert.strictEqual(actual, text);
    assert.deepStrictEqual(Buffer.from(actual, 'utf-8'), bytes);
    assert.strictEqual(requests.length, 2);
    for (const { url, headers } of requests) {
      assert.strictEqual(url.origin, 'https://api.github.com');
      assert.strictEqual(
        decodeURIComponent(url.pathname),
        '/repos/octocat/private-repo/contents/docs/large file.txt'
      );
      assert.strictEqual(url.searchParams.get('ref'), location.ref);
      assert.strictEqual(
        headers.get('authorization'),
        'token private-test-token'
      );
    }
    assert.strictEqual(
      requests[1]?.headers.get('accept'),
      'application/vnd.github.raw+json'
    );
  });

  it('should leave base64 contents on the single-request path', async () => {
    const text = '\uFEFFsmall file\r\n\u{1F9EA}';
    const fetch = mock.method(globalThis, 'fetch', async () =>
      Response.json({
        type: 'file',
        encoding: 'base64',
        content: Buffer.from(text, 'utf-8').toString('base64'),
      })
    );
    const importer = new GhFileImporter({ destDir: '/tmp', auth: '' });

    assert.strictEqual(await importer.fetchFileText(location), text);
    assert.strictEqual(fetch.mock.callCount(), 1);
  });

  it('should preserve raw JSON text without parsing it as API metadata', async () => {
    const text = '{ "formatting": true }\n';
    let requests = 0;
    mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
      const url = new URL(String(input));
      assert.strictEqual(url.searchParams.has('ref'), false);
      requests += 1;
      return requests === 1
        ? fileMetadata(1024 * 1024 + 1)
        : new Response(text, {
            headers: { 'content-type': 'application/json' },
          });
    });
    const importer = new GhFileImporter({ destDir: '/tmp', auth: '' });
    const { ref: _ref, ...defaultBranch } = location;

    assert.strictEqual(await importer.fetchFileText(defaultBranch), text);
    assert.strictEqual(requests, 2);
  });

  it('should preserve an HTTP failure from the raw request', async () => {
    let requests = 0;
    mock.method(
      globalThis,
      'fetch',
      async (_input: string | URL | Request, init?: RequestInit) => {
        assert.strictEqual(
          new Headers(init?.headers).get('authorization'),
          'token private-test-token'
        );
        requests += 1;
        return requests === 1
          ? fileMetadata(1024 * 1024 + 1)
          : Response.json({ message: 'Forbidden' }, { status: 403 });
      }
    );
    const importer = new GhFileImporter({
      destDir: '/tmp',
      auth: 'private-test-token',
      logLevel: 'fatal',
    });

    await assert.rejects(() => importer.fetchFileText(location), {
      name: 'HttpError',
      status: 403,
      message: 'Forbidden',
    });
    assert.strictEqual(requests, 2);
  });

  it('should propagate a raw body read failure without returning partial text', async () => {
    const failure = new Error('Response body failed');
    let requests = 0;
    mock.method(globalThis, 'fetch', async () => {
      requests += 1;
      if (requests === 1) return fileMetadata(1024 * 1024 + 1);
      return new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.error(failure);
          },
        })
      );
    });
    const importer = new GhFileImporter({ destDir: '/tmp', auth: '' });

    await assert.rejects(
      () => importer.fetchFileText(location),
      (error) => error === failure
    );
    assert.strictEqual(requests, 2);
  });
});
