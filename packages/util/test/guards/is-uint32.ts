// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isUint32 } from '../../src/guards/is-uint32';

describe(isUint32.name, () => {
  it('should detect uint32 values', () => {
    assert.strictEqual(isUint32(123), true);
    assert.strictEqual(isUint32(0), true);
  });

  it('should reject non-uint32 values', () => {
    assert.strictEqual(isUint32(-1), false);
    assert.strictEqual(isUint32('abc'), false);
    assert.strictEqual(isUint32(4294967296), false);
    assert.strictEqual(isUint32(1.5), false);
    assert.strictEqual(isUint32(Number.NaN), false);
    assert.strictEqual(isUint32(Number.POSITIVE_INFINITY), false);
  });

  it('should not coerce non-number values', () => {
    assert.strictEqual(isUint32('123'), false);
    assert.strictEqual(isUint32(true), false);
    assert.strictEqual(isUint32(null), false);
    assert.strictEqual(isUint32([]), false);
    assert.strictEqual(isUint32(123n), false);
    assert.doesNotThrow(() => isUint32(Symbol('123')));
    assert.strictEqual(isUint32(Symbol('123')), false);
  });
});
