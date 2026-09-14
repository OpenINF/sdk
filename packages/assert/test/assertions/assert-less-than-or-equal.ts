// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertLessThanOrEqual } from '../../src/assertions/assert-less-than-or-equal';

describe(assertLessThanOrEqual.name, () => {
  it('should not throw when a is less than or equal to b', () => {
    assert.doesNotThrow(() => assertLessThanOrEqual(1, 2));
    assert.doesNotThrow(() => assertLessThanOrEqual(1, 1));
  });

  it('should throw when a is greater than b', () => {
    assert.throws(() => assertLessThanOrEqual(2, 1), /Expected 2 <= 1/);
  });
  it('should throw when either operand is NaN', () => {
    assert.throws(() => assertLessThanOrEqual(Number.NaN, 1));
    assert.throws(() => assertLessThanOrEqual(1, Number.NaN));
  });
});
