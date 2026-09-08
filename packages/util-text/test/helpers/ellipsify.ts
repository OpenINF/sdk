// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

function freshRequire(id: string) {
  delete require.cache[require.resolve(id)];
  return require(id);
}

describe('ellipsify', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should append a Unicode ellipsis when Unicode is supported', () => {
    mock.module('../../src/_internal/has-unicode.js', {
      exports: { hasUnicode: () => true },
    });
    const { ellipsify } = freshRequire('../../src/helpers/ellipsify');
    assert.strictEqual(ellipsify('foo'), 'foo…');
  });

  it('should append three dots when Unicode is unsupported', () => {
    mock.module('../../src/_internal/has-unicode.js', {
      exports: { hasUnicode: () => false },
    });
    const { ellipsify } = freshRequire('../../src/helpers/ellipsify');
    assert.strictEqual(ellipsify('foo'), 'foo...');
  });
});
