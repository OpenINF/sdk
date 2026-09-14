// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateArray } from '../../src/validators/validate-array';

describe(validateArray.name, () => {
  it('should not throw for a valid array', () => {
    assert.doesNotThrow(() => validateArray([1, 2, 3], 'argName', 1));
  });

  it('should throw when value is not an Array', () => {
    assert.throws(() => validateArray('not an array', 'argName', 0));
  });

  it('should throw when the array is shorter than minLength', () => {
    assert.throws(
      () => validateArray([1], 'argName', 2),
      /must have a length of at least 2/
    );
  });

  it('should accept an array holding exactly minLength elements', () => {
    // The bound is inclusive. The message used to say "longer than", which
    // would have sent a caller to add an element this accepts without.
    assert.doesNotThrow(() => validateArray([1, 2], 'argName', 2));
    assert.doesNotThrow(() => validateArray([], 'argName', 0));
  });
});
