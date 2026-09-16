// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isInteger } from '../../src/guards/is-integer';
import { isSafeInteger } from '../../src/guards/is-safe-integer';

describe(isSafeInteger.name, () => {
  it('should accept the ends of the safe range', () => {
    assert.strictEqual(isSafeInteger(Number.MAX_SAFE_INTEGER), true);
    assert.strictEqual(isSafeInteger(Number.MIN_SAFE_INTEGER), true);
    assert.strictEqual(isSafeInteger(0), true);
  });

  // Where isInteger and isSafeInteger part: beyond the safe range one value
  // stands for several, so an integer there is not one JavaScript can tell
  // from its neighbors.
  it('should reject an integer beyond it, which isInteger accepts', () => {
    assert.strictEqual(isInteger(2 ** 53), true);
    assert.strictEqual(isSafeInteger(2 ** 53), false);
    assert.strictEqual(2 ** 53 === 2 ** 53 + 1, true);
  });

  it('should reject a non-integer, and a non-number', () => {
    assert.strictEqual(isSafeInteger(1.5), false);
    assert.strictEqual(isSafeInteger(Number.NaN), false);
    assert.strictEqual(isSafeInteger(Number.POSITIVE_INFINITY), false);
    assert.strictEqual(isSafeInteger('1'), false);
  });
});
