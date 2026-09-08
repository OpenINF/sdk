// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { contains } from '../../src/helpers/contains';

describe(contains.name, () => {
  it('should return true when the value is present', () => {
    assert.strictEqual(contains([1, 2, 3], 2), true);
  });

  it('should return false when the value is absent', () => {
    assert.strictEqual(contains([1, 2, 3], 4), false);
  });

  it('should return false for an undefined array', () => {
    assert.strictEqual(contains(undefined, 1), false);
  });

  it('should use a custom equality comparer when provided', () => {
    const sameParity = (a: number, b: number): boolean => a % 2 === b % 2;
    assert.strictEqual(contains([1, 3, 5], 4, sameParity), false);
    assert.strictEqual(contains([1, 3, 4], 4, sameParity), true);
  });
});
