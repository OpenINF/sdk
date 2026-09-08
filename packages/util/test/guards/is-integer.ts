// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isInteger } from '../../src/guards/is-integer';

describe(isInteger.name, () => {
  it('should detect integers', () => {
    assert.strictEqual(isInteger(3), true);
    assert.strictEqual(isInteger(0), true);
    assert.strictEqual(isInteger(-3), true);
  });

  it('should reject non-integers', () => {
    assert.strictEqual(isInteger(3.5), false);
    assert.strictEqual(isInteger(Infinity), false);
    assert.strictEqual(isInteger('3'), false);
  });
});
