// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isFiniteNumber } from '../../src/guards/is-finite-number';

describe(isFiniteNumber.name, () => {
  it('should detect finite numbers', () => {
    assert.strictEqual(isFiniteNumber(0), true);
    assert.strictEqual(isFiniteNumber(-42), true);
  });

  it('should reject non-finite numbers and non-numbers', () => {
    assert.strictEqual(isFiniteNumber(Infinity), false);
    assert.strictEqual(isFiniteNumber(-Infinity), false);
    assert.strictEqual(isFiniteNumber(NaN), false);
    assert.strictEqual(isFiniteNumber('0'), false);
  });
});
