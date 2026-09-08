// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateInteger } from '../../src/validators/validate-integer';

describe(validateInteger.name, () => {
  it('should not throw for an integer within range', () => {
    assert.doesNotThrow(() => validateInteger(5, 'value', 0, 10));
  });

  it('should throw a TypeError for a non-number', () => {
    assert.throws(() => validateInteger('5', 'value'), TypeError);
  });

  it('should throw a RangeError for a non-integer', () => {
    assert.throws(() => validateInteger(5.5, 'value'), RangeError);
  });

  it('should throw a RangeError for a value outside the given range', () => {
    assert.throws(() => validateInteger(20, 'value', 0, 10), RangeError);
    assert.throws(() => validateInteger(-1, 'value', 0, 10), RangeError);
  });
});
