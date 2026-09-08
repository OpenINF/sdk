// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNegativeInteger } from '../../src/guards/is-negative-integer';

describe(isNegativeInteger.name, () => {
  it('should detect negative integers', () => {
    assert.strictEqual(isNegativeInteger(-1), true);
    assert.strictEqual(isNegativeInteger(-42), true);
  });

  it('should reject non-negative-integers', () => {
    assert.strictEqual(isNegativeInteger(-1.5), false);
    assert.strictEqual(isNegativeInteger(1), false);
    assert.strictEqual(isNegativeInteger(0), false);
  });
});
