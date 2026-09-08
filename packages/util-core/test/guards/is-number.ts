// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNumber } from '../../src/guards/is-number';

describe(isNumber.name, () => {
  it('should detect numbers', () => {
    assert.strictEqual(isNumber(0), true);
    assert.strictEqual(isNumber(Number.MIN_VALUE), true);
    assert.strictEqual(isNumber(NaN), true);
    assert.strictEqual(isNumber(Infinity), true);
  });

  it('should reject non-numbers', () => {
    assert.strictEqual(isNumber('0'), false);
    assert.strictEqual(isNumber(null), false);
  });
});
