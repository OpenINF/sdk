// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

function freshRequire(id: string) {
  delete require.cache[require.resolve(id)];
  return require(id);
}

describe('redden', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should colorize the string red when ANSI is supported', () => {
    mock.module('../../src/_internal/supports-ansi.js', {
      exports: { supportsAnsi: () => true },
    });
    const { redden } = freshRequire('../../src/helpers/redden');
    const result: string = redden('foo');
    assert.notStrictEqual(result, 'foo');
    assert.ok(result.includes('foo'));
  });

  it('should return the string unchanged when ANSI is unsupported', () => {
    mock.module('../../src/_internal/supports-ansi.js', {
      exports: { supportsAnsi: () => false },
    });
    const { redden } = freshRequire('../../src/helpers/redden');
    assert.strictEqual(redden('foo'), 'foo');
  });
});
