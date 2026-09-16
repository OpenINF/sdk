// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isInt8 } from '../../src/guards/is-int8';

describe(isInt8.name, () => {
  it('should accept the ends of the range, and zero', () => {
    assert.strictEqual(isInt8(-128), true);
    assert.strictEqual(isInt8(127), true);
    assert.strictEqual(isInt8(0), true);
    assert.strictEqual(isInt8(-0), true);
  });

  it('should reject a number outside the range', () => {
    assert.strictEqual(isInt8(-128 - 1), false);
    assert.strictEqual(isInt8(127 + 1), false);
  });

  it('should reject a non-integer, and a non-number', () => {
    assert.strictEqual(isInt8(1.5), false);
    assert.strictEqual(isInt8(Number.NaN), false);
    assert.strictEqual(isInt8('1'), false);
    assert.strictEqual(isInt8(1n), false);
  });
});
