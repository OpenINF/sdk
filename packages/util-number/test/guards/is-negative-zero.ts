// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNegativeZero } from '../../src/guards/is-negative-zero';

describe(isNegativeZero.name, () => {
  it('should detect negative zero', () => {
    assert.strictEqual(isNegativeZero(-0), true);
  });

  // The reason the guard exists: the operators cannot tell the two zeroes
  // apart, and the specification keeps them apart everywhere.
  it('should tell it from positive zero, which === cannot', () => {
    assert.strictEqual(isNegativeZero(0), false);
    assert.strictEqual(-0 === 0, true);
    assert.strictEqual(isNegativeZero(0 * -1), true);
  });

  it('should reject other numbers and non-numbers', () => {
    assert.strictEqual(isNegativeZero(-1), false);
    assert.strictEqual(isNegativeZero(Number.NaN), false);
    assert.strictEqual(isNegativeZero('-0'), false);
    assert.strictEqual(isNegativeZero(-0n), false);
  });
});
