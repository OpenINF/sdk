// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateOneOf } from '../../src/validators/validate-one-of';

describe(validateOneOf.name, () => {
  it('should not throw when the value is one of the allowed values', () => {
    assert.doesNotThrow(() => validateOneOf('b', 'value', ['a', 'b', 'c']));
  });

  it('should throw a coded TypeError when the value is not allowed', () => {
    assert.throws(
      () => validateOneOf('d', 'value', ['a', 'b', 'c']),
      TypeError
    );
    assert.throws(() => validateOneOf('d', 'value', ['a', 'b', 'c']), {
      code: 'ERR_INVALID_ARG_VALUE',
      message:
        'The argument \u201Cvalue\u201D must be one of: \u201Ca\u201D, ' +
        '\u201Cb\u201D, \u201Cc\u201D. Received type \u201Cstring\u201D ' +
        '(\u201Cd\u201D)',
    });
  });

  it('should count NaN as equal to itself, as includes does', () => {
    assert.doesNotThrow(() => validateOneOf(Number.NaN, 'value', [Number.NaN]));
  });

  it('should describe a non-string value without quotes', () => {
    assert.throws(() => validateOneOf(3, 'value', [1, 2]), {
      message: /must be one of: 1, 2\./,
    });
  });
});
