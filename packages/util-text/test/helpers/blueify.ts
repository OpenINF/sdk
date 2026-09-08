// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

function freshRequire(id: string) {
  delete require.cache[require.resolve(id)];
  return require(id);
}

describe('blueify', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should colorize the string blue when ANSI is supported', () => {
    mock.module('../../src/_internal/supports-ansi.js', {
      exports: { supportsAnsi: () => true },
    });
    const { blueify } = freshRequire('../../src/helpers/blueify');
    const result: string = blueify('foo');
    assert.notStrictEqual(result, 'foo');
    assert.ok(result.includes('foo'));
  });

  it('should return the string unchanged when ANSI is unsupported', () => {
    mock.module('../../src/_internal/supports-ansi.js', {
      exports: { supportsAnsi: () => false },
    });
    const { blueify } = freshRequire('../../src/helpers/blueify');
    assert.strictEqual(blueify('foo'), 'foo');
  });
});
