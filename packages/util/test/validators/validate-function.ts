// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateFunction } from '../../src/validators/validate-function';

describe(validateFunction.name, () => {
  it('should not throw for a function', () => {
    assert.doesNotThrow(() => validateFunction(() => {}, 'argName'));
  });

  it('should throw for a non-function', () => {
    assert.throws(() => validateFunction('not a function', 'argName'));
  });
});
