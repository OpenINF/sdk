// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArgValidFunction } from '../../src/validators/is-arg-valid-function';

describe(isArgValidFunction.name, () => {
  it('should not throw for a function', () => {
    assert.doesNotThrow(() => isArgValidFunction(() => {}, 'argName'));
  });

  it('should throw for a non-function', () => {
    assert.throws(() => isArgValidFunction('not a function', 'argName'));
  });
});
