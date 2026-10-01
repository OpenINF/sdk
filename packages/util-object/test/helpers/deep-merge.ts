// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { deepMerge } from '../../src/helpers/deep-merge';

describe(deepMerge.name, () => {
  it('should deep-merge nested objects, keeping unshared keys', () => {
    const result = deepMerge({ a: { x: 1 }, b: 3 }, { a: { y: 2 } });
    assert.deepStrictEqual(result, { a: { x: 1, y: 2 }, b: 3 });
  });

  it('should mutate and return the target object', () => {
    const target = { a: 1 };
    assert.strictEqual(deepMerge(target, { b: 2 }), target);
  });

  it('should replace arrays rather than merging their indexes', () => {
    const sourceArray = [9];
    const result = deepMerge({ values: [1, 2, 3] }, { values: sourceArray });

    assert.strictEqual(result['values'], sourceArray);
    assert.deepStrictEqual(result, { values: [9] });
  });

  it('should replace an array with an object rather than merging it', () => {
    const sourceObject = { value: 'source' };
    const result = deepMerge({ item: ['target'] }, { item: sourceObject });

    assert.strictEqual(result['item'], sourceObject);
  });

  it('should shallowly assign beyond the max depth', () => {
    const result = deepMerge(
      { a: { b: { c: 1 } } },
      { a: { b: { c: 2, d: 3 } } },
      0
    );
    assert.deepStrictEqual(result, { a: { b: { c: 2, d: 3 } } });
  });

  it('should filter unsafe keys beyond the max depth', () => {
    const nested = JSON.parse(
      '{"__proto__":{"polluted":true},"safe":"kept"}'
    ) as Record<string, unknown>;
    const result = deepMerge({ a: {} }, { a: nested }, 0);

    assert.deepStrictEqual(result, { a: { safe: 'kept' } });
    assert.strictEqual(Object.getPrototypeOf(result.a), Object.prototype);
  });

  it('should merge shared acyclic objects at each target path', () => {
    const shared = { value: 'kept' };
    const result = deepMerge({ a: {}, b: {} }, { a: shared, b: shared });

    assert.deepStrictEqual(result, {
      a: { value: 'kept' },
      b: { value: 'kept' },
    });
  });

  it('should throw when the source has a circular reference reachable via a shared key path', () => {
    const source: any = { a: {} };
    source.a.self = source;
    const target: any = { a: { self: {} } };

    assert.throws(
      () => deepMerge(target, source),
      /Source object has a circular reference\./
    );
  });

  it('should replace a Date or a Map the target holds rather than merge into it', () => {
    const when = new Date(5);
    const map = new Map([[2, 2]]);
    const result = deepMerge(
      { when: new Date(0), map: new Map([[1, 1]]) },
      { when, map }
    );

    assert.strictEqual(result['when'], when);
    assert.strictEqual(result['map'], map);
  });
});
