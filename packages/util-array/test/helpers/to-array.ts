// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { toArray } from '../../src/helpers/to-array';

describe(toArray.name, () => {
  it('should return the same array untouched', () => {
    const original = [1, 2, 3];
    assert.strictEqual(toArray(original), original);
  });

  it('should wrap a non-array value in an array', () => {
    assert.deepStrictEqual(toArray('a'), ['a']);
    assert.deepStrictEqual(toArray(5), [5]);
    assert.deepStrictEqual(toArray(null), [null]);
  });
});
