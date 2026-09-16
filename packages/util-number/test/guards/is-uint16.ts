// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isUint16 } from '../../src/guards/is-uint16';

describe(isUint16.name, () => {
  it('should accept the ends of the range, and zero', () => {
    assert.strictEqual(isUint16(0), true);
    assert.strictEqual(isUint16(65535), true);
    assert.strictEqual(isUint16(0), true);
    assert.strictEqual(isUint16(-0), true);
  });

  it('should reject a number outside the range', () => {
    assert.strictEqual(isUint16(0 - 1), false);
    assert.strictEqual(isUint16(65535 + 1), false);
  });

  it('should reject a non-integer, and a non-number', () => {
    assert.strictEqual(isUint16(1.5), false);
    assert.strictEqual(isUint16(Number.NaN), false);
    assert.strictEqual(isUint16('1'), false);
    assert.strictEqual(isUint16(1n), false);
  });
});
