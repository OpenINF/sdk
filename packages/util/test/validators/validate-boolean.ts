// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateBoolean } from '../../src/validators/validate-boolean';

describe(validateBoolean.name, () => {
  it('should not throw for a boolean value', () => {
    assert.doesNotThrow(() => validateBoolean(true, 'argName'));
  });

  it('should throw for a non-boolean value', () => {
    assert.throws(() => validateBoolean('true', 'argName'));
  });
});
