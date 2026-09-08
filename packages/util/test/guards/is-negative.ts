// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNegative } from '../../src/guards/is-negative';

describe(isNegative.name, () => {
  it('should detect negative numbers', () => {
    assert.strictEqual(isNegative(-1), true);
    assert.strictEqual(isNegative(-0.5), true);
  });

  it('should reject non-negative numbers and non-numbers', () => {
    assert.strictEqual(isNegative(0), false);
    assert.strictEqual(isNegative(1), false);
    assert.strictEqual(isNegative('-1'), false);
  });
});
