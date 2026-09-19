// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isInt16 } from '../../src/guards/is-int16';

describe(isInt16.name, () => {
  it('should accept the ends of the range and +0, but reject -0', () => {
    assert.strictEqual(isInt16(-32768), true);
    assert.strictEqual(isInt16(32767), true);
    assert.strictEqual(isInt16(0), true);
    assert.strictEqual(isInt16(-0), false);
  });

  it('should reject a number outside the range', () => {
    assert.strictEqual(isInt16(-32768 - 1), false);
    assert.strictEqual(isInt16(32767 + 1), false);
  });

  it('should reject a non-integer, and a non-number', () => {
    assert.strictEqual(isInt16(1.5), false);
    assert.strictEqual(isInt16(Number.NaN), false);
    assert.strictEqual(isInt16('1'), false);
    assert.strictEqual(isInt16(1n), false);
  });
});
