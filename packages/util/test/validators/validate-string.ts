// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateString } from '../../src/validators/validate-string';

describe(validateString.name, () => {
  it('should not throw for a string', () => {
    assert.doesNotThrow(() => validateString('foo', 'argName'));
  });

  it('should throw for a non-string', () => {
    assert.throws(() => validateString(42, 'argName'));
  });
});
