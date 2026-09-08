// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateIntegerRange } from '../../src/validators/validate-integer-range';

describe(validateIntegerRange.name, () => {
  it('should not throw for an integer within range', () => {
    assert.doesNotThrow(() => validateIntegerRange(5, 'value', 0, 10));
  });

  it('should throw for a non-integer', () => {
    assert.throws(() => validateIntegerRange(5.5, 'value'));
  });

  it('should throw for a value outside the given range', () => {
    assert.throws(() => validateIntegerRange(20, 'value', 0, 10));
  });

  it('should default to 32-bit integer bounds', () => {
    assert.throws(() => validateIntegerRange(2147483648, 'value'));
    assert.doesNotThrow(() => validateIntegerRange(2147483647, 'value'));
  });
});
