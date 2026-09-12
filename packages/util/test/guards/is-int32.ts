// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isInt32 } from '../../src/guards/is-int32';

describe(isInt32.name, () => {
  it('should detect int32 values', () => {
    assert.strictEqual(isInt32(123), true);
    assert.strictEqual(isInt32(-123), true);
    assert.strictEqual(isInt32(0), true);
  });

  it('should reject non-int32 values', () => {
    assert.strictEqual(isInt32('abc'), false);
    assert.strictEqual(isInt32(2147483648), false);
    assert.strictEqual(isInt32(-2147483649), false);
    assert.strictEqual(isInt32(1.5), false);
    assert.strictEqual(isInt32(Number.NaN), false);
    assert.strictEqual(isInt32(Number.POSITIVE_INFINITY), false);
  });

  it('should not coerce non-number values', () => {
    assert.strictEqual(isInt32('123'), false);
    assert.strictEqual(isInt32(true), false);
    assert.strictEqual(isInt32(null), false);
    assert.strictEqual(isInt32([]), false);
    assert.strictEqual(isInt32(123n), false);
    assert.doesNotThrow(() => isInt32(Symbol('123')));
    assert.strictEqual(isInt32(Symbol('123')), false);
  });
});
