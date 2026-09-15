// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isPositive } from '../../src/guards/is-positive';

describe(isPositive.name, () => {
  it('should detect positive numbers', () => {
    assert.strictEqual(isPositive(1), true);
    assert.strictEqual(isPositive(0.5), true);
  });

  it('should reject non-positive numbers and non-numbers', () => {
    assert.strictEqual(isPositive(0), false);
    assert.strictEqual(isPositive(-1), false);
    assert.strictEqual(isPositive('1'), false);
  });
});
