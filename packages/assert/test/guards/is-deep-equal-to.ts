// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isDeepEqualTo } from '../../src/guards/is-deep-equal-to';

describe(isDeepEqualTo.name, () => {
  it('should match deeply equal plain objects', () => {
    const guard = isDeepEqualTo({ a: [1, 2], b: { c: 3 } });
    assert.strictEqual(guard({ a: [1, 2], b: { c: 3 } }), true);
  });

  it('should reject objects that differ at any depth', () => {
    const guard = isDeepEqualTo({ a: [1, 2], b: { c: 3 } });
    assert.strictEqual(guard({ a: [1, 3], b: { c: 3 } }), false);
  });

  it('should reject objects with a different set of keys', () => {
    const guard = isDeepEqualTo({ a: 1, b: 2 });
    assert.strictEqual(guard({ a: 1 }), false);
  });

  it('should match deeply equal arrays', () => {
    assert.strictEqual(isDeepEqualTo([1, 2, 3])([1, 2, 3]), true);
    assert.strictEqual(isDeepEqualTo([1, 2, 3])([1, 2]), false);
  });

  it('should use SameValueZero semantics for primitives', () => {
    assert.strictEqual(isDeepEqualTo(NaN)(NaN), true);
    assert.strictEqual(isDeepEqualTo(1)('1'), false);
  });

  it('should reject when only one side is an object', () => {
    assert.strictEqual(isDeepEqualTo({ a: 1 })(null), false);
    assert.strictEqual(isDeepEqualTo([1])({ 0: 1, length: 1 }), false);
  });
});
