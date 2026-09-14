// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateInt32 } from '../../src/validators/validate-int32';

describe(validateInt32.name, () => {
  it('should not throw for a valid int32 within range', () => {
    assert.doesNotThrow(() => validateInt32(5, 'argName', 0, 10));
  });

  it('should throw for a non-number', () => {
    assert.throws(() => validateInt32('abc', 'argName'));
  });

  it('should throw for a non-integer number', () => {
    assert.throws(() => validateInt32(5.5, 'argName'));
  });

  it('should throw when out of the specified range', () => {
    assert.throws(() => validateInt32(20, 'argName', 0, 10));
  });
});
