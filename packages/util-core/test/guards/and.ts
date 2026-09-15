// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { and } from '../../src/guards/and';
import { isNumber } from '../../src/guards/is-number';

describe(and.name, () => {
  const isPositive = Object.assign(
    (value: unknown): value is number => (value as number) > 0,
    { expectation: 'be a positive number' }
  );
  const isPositiveNumber = and(isNumber, isPositive);

  it('should return true only when every guard passes', () => {
    assert.strictEqual(isPositiveNumber(1), true);
  });

  it('should return false when any guard fails', () => {
    assert.strictEqual(isPositiveNumber(-1), false);
    assert.strictEqual(isPositiveNumber('1'), false);
  });

  it('should combine expectations from all guards', () => {
    assert.notStrictEqual(isPositiveNumber.expectation, undefined);
    const expectation =
      typeof isPositiveNumber.expectation === 'function'
        ? isPositiveNumber.expectation()
        : isPositiveNumber.expectation;
    assert.strictEqual(expectation, 'be a number and be a positive number');
  });
});
