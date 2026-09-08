// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

function freshRequire(id: string) {
  delete require.cache[require.resolve(id)];
  return require(id);
}

describe('underline', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should underline the string when ANSI is supported', () => {
    mock.module('../../src/_internal/supports-ansi.js', {
      exports: { supportsAnsi: () => true },
    });
    const { underline } = freshRequire('../../src/helpers/underline');
    const result: string = underline('foo');
    assert.notStrictEqual(result, 'foo');
    assert.ok(result.includes('foo'));
  });

  it('should return the string unchanged when ANSI is unsupported', () => {
    mock.module('../../src/_internal/supports-ansi.js', {
      exports: { supportsAnsi: () => false },
    });
    const { underline } = freshRequire('../../src/helpers/underline');
    assert.strictEqual(underline('foo'), 'foo');
  });
});
