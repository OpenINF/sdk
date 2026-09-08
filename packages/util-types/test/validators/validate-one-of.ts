// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateOneOf } from '../../src/validators/validate-one-of';

describe(validateOneOf.name, () => {
  it('should not throw when the value is one of the allowed values', () => {
    assert.doesNotThrow(() => validateOneOf('b', 'value', ['a', 'b', 'c']));
  });

  it('should throw a TypeError when the value is not allowed', () => {
    assert.throws(
      () => validateOneOf('d', 'value', ['a', 'b', 'c']),
      TypeError
    );
    assert.throws(
      () => validateOneOf('d', 'value', ['a', 'b', 'c']),
      /The 'value' argument must be one of: 'a', 'b', 'c'\. Received 'd'/
    );
  });
});
