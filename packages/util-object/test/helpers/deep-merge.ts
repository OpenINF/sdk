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

  it('should fall back to Object.assign beyond the max depth', () => {
    const result = deepMerge(
      { a: { b: { c: 1 } } },
      { a: { b: { c: 2, d: 3 } } },
      0
    );
    assert.deepStrictEqual(result, { a: { b: { c: 2, d: 3 } } });
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
});
