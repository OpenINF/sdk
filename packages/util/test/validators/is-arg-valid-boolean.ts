// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArgValidBoolean } from '../../src/validators/is-arg-valid-boolean';

describe(isArgValidBoolean.name, () => {
  it('should not throw for a boolean value', () => {
    assert.doesNotThrow(() => isArgValidBoolean(true, 'argName'));
  });

  it('should throw for a non-boolean value', () => {
    assert.throws(() => isArgValidBoolean('true', 'argName'));
  });
});
