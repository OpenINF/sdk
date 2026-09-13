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
    assert.strictEqual(isDeepEqualTo(0)(-0), true);
    assert.strictEqual(isDeepEqualTo(1)('1'), false);
  });

  it('should reject when only one side is an object', () => {
    assert.strictEqual(isDeepEqualTo({ a: 1 })(null), false);
    assert.strictEqual(isDeepEqualTo([1])({ 0: 1, length: 1 }), false);
  });

  it('should distinguish array holes from explicit undefined values', () => {
    assert.strictEqual(isDeepEqualTo([undefined])(new Array(1)), false);
    assert.strictEqual(isDeepEqualTo(new Array(1))([undefined]), false);
  });

  it('should compare enumerable symbol properties', () => {
    const key = Symbol('key');
    assert.strictEqual(isDeepEqualTo({ [key]: 1 })({ [key]: 1 }), true);
    assert.strictEqual(isDeepEqualTo({ [key]: 1 })({ [key]: 2 }), false);
  });

  it('should reject distinct non-plain objects', () => {
    assert.strictEqual(
      isDeepEqualTo(new Date('2026-01-01'))(new Date('2026-01-01')),
      false
    );
    assert.strictEqual(isDeepEqualTo(new Map())(new Map()), false);
    assert.strictEqual(isDeepEqualTo(/same/)(/same/), false);
  });

  it('should still accept the same non-plain object by reference', () => {
    const date = new Date('2026-01-01');
    assert.strictEqual(isDeepEqualTo(date)(date), true);
  });

  it('should compare circular structures without recursing forever', () => {
    const expected: { name: string; self?: unknown } = { name: 'cycle' };
    expected.self = expected;
    const actual: { name: string; self?: unknown } = { name: 'cycle' };
    actual.self = actual;

    assert.strictEqual(isDeepEqualTo(expected)(actual), true);
    const expectation = isDeepEqualTo(expected).expectation;
    assert.strictEqual(typeof expectation, 'function');
    if (typeof expectation === 'function') {
      assert.doesNotThrow(expectation);
    }
  });

  it('should reject circular structures with different topology', () => {
    const expected: { self?: unknown } = {};
    expected.self = expected;
    const actual = { self: {} };

    assert.strictEqual(isDeepEqualTo(expected)(actual), false);
  });
});
