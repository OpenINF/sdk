// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { pushIfUnique } from '../../src/helpers/push-if-unique';

describe(pushIfUnique.name, () => {
  it('should push and return true when the value is not already present', () => {
    const array = [1, 2];
    assert.strictEqual(pushIfUnique(array, 3), true);
    assert.deepStrictEqual(array, [1, 2, 3]);
  });

  it('should not push and return false when the value is already present', () => {
    const array = [1, 2];
    assert.strictEqual(pushIfUnique(array, 2), false);
    assert.deepStrictEqual(array, [1, 2]);
  });

  it('should use a custom equality comparer when provided', () => {
    const array = [1, 3, 5];
    const sameParity = (a: number, b: number): boolean => a % 2 === b % 2;
    assert.strictEqual(pushIfUnique(array, 7, sameParity), false);
    assert.deepStrictEqual(array, [1, 3, 5]);
  });
});
