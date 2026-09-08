// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArgValidArray } from '../../src/validators/is-arg-valid-array';

describe(isArgValidArray.name, () => {
  it('should not throw for a valid array', () => {
    assert.doesNotThrow(() => isArgValidArray([1, 2, 3], 'argName', 1));
  });

  it('should throw when value is not an Array', () => {
    assert.throws(() => isArgValidArray('not an array', 'argName', 0));
  });

  it('should throw when the array is shorter than minLength', () => {
    assert.throws(() => isArgValidArray([1], 'argName', 2));
  });
});
