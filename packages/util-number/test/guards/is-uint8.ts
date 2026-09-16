// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isUint8 } from '../../src/guards/is-uint8';

describe(isUint8.name, () => {
  it('should accept the ends of the range, and zero', () => {
    assert.strictEqual(isUint8(0), true);
    assert.strictEqual(isUint8(255), true);
    assert.strictEqual(isUint8(0), true);
    assert.strictEqual(isUint8(-0), true);
  });

  it('should reject a number outside the range', () => {
    assert.strictEqual(isUint8(0 - 1), false);
    assert.strictEqual(isUint8(255 + 1), false);
  });

  it('should reject a non-integer, and a non-number', () => {
    assert.strictEqual(isUint8(1.5), false);
    assert.strictEqual(isUint8(Number.NaN), false);
    assert.strictEqual(isUint8('1'), false);
    assert.strictEqual(isUint8(1n), false);
  });
});
