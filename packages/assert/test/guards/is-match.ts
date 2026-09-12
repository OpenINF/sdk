// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isMatch } from '../../src/guards/is-match';

describe(isMatch.name, () => {
  it('should match strings that satisfy the pattern', () => {
    const guard = isMatch(/^foo/);
    assert.strictEqual(guard('foobar'), true);
  });

  it('should reject strings that do not satisfy the pattern', () => {
    const guard = isMatch(/^foo/);
    assert.strictEqual(guard('barfoo'), false);
  });

  it('should reject non-string values', () => {
    const guard = isMatch(/^foo/);
    assert.strictEqual(guard(42), false);
    assert.strictEqual(guard(null), false);
  });

  it('should return the same result across calls for global patterns', () => {
    const pattern = /foo/g;
    const guard = isMatch(pattern);

    assert.strictEqual(guard('foo'), true);
    assert.strictEqual(guard('foo'), true);
    assert.strictEqual(guard('foo'), true);
    assert.strictEqual(pattern.lastIndex, 0);
  });

  it('should start sticky patterns at the beginning on every call', () => {
    const guard = isMatch(/foo/y);

    assert.strictEqual(guard('foo'), true);
    assert.strictEqual(guard('foo'), true);
    assert.strictEqual(guard('barfoo'), false);
  });
});
