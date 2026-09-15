// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isPositiveInteger } from '../../src/guards/is-positive-integer';

describe(isPositiveInteger.name, () => {
  it('should detect positive integers', () => {
    assert.strictEqual(isPositiveInteger(1), true);
    assert.strictEqual(isPositiveInteger(42), true);
  });

  it('should reject non-positive-integers', () => {
    assert.strictEqual(isPositiveInteger(1.5), false);
    assert.strictEqual(isPositiveInteger(-1), false);
    assert.strictEqual(isPositiveInteger(0), false);
  });
});
