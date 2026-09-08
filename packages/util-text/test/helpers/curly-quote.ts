// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

function freshRequire(id: string) {
  delete require.cache[require.resolve(id)];
  return require(id);
}

describe('curlyQuote', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should curly quote the string when Unicode is supported', () => {
    mock.module('../../src/_internal/has-unicode.js', {
      exports: { hasUnicode: () => true },
    });
    const { curlyQuote } = freshRequire('../../src/helpers/curly-quote');
    assert.strictEqual(curlyQuote('foo'), '“foo”');
  });

  it('should straight quote the string when Unicode is unsupported', () => {
    mock.module('../../src/_internal/has-unicode.js', {
      exports: { hasUnicode: () => false },
    });
    const { curlyQuote } = freshRequire('../../src/helpers/curly-quote');
    assert.strictEqual(curlyQuote('foo'), '"foo"');
  });
});
