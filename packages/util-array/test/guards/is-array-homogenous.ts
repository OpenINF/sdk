// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  arrayIsHomogeneous,
  equateValues,
} from '../../src/guards/is-array-homogenous';

describe(equateValues.name, () => {
  it('should compare values with strict equality', () => {
    assert.strictEqual(equateValues(1, 1), true);
    assert.strictEqual(equateValues(1, '1' as unknown as number), false);
  });
});

describe(arrayIsHomogeneous.name, () => {
  it('should return true for arrays with fewer than two elements', () => {
    assert.strictEqual(arrayIsHomogeneous([]), true);
    assert.strictEqual(arrayIsHomogeneous([1]), true);
  });

  it('should return true when every element compares equal', () => {
    assert.strictEqual(arrayIsHomogeneous([1, 1, 1]), true);
  });

  it('should return false when any element differs from the first', () => {
    assert.strictEqual(arrayIsHomogeneous([1, 2, 1]), false);
  });

  it('should use a custom comparer when provided', () => {
    const sameParity = (a: number, b: number): boolean => a % 2 === b % 2;
    assert.strictEqual(arrayIsHomogeneous([2, 4, 6], sameParity), true);
    assert.strictEqual(arrayIsHomogeneous([2, 3, 6], sameParity), false);
  });
});
