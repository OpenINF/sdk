// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArgValidInt32 } from '../../src/validators/is-arg-valid-int32';

describe(isArgValidInt32.name, () => {
  it('should not throw for a valid int32 within range', () => {
    assert.doesNotThrow(() => isArgValidInt32(5, 'argName', 0, 10));
  });

  it('should throw for a non-number', () => {
    assert.throws(() => isArgValidInt32('abc', 'argName'));
  });

  it('should throw for a non-integer number', () => {
    assert.throws(() => isArgValidInt32(5.5, 'argName'));
  });

  it('should throw when out of the specified range', () => {
    assert.throws(() => isArgValidInt32(20, 'argName', 0, 10));
  });
});
