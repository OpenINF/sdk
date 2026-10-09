// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { curlyQuote } from '@openinf/util-text';

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
      // The quotes are curly only where the locale says the terminal can show
      // them, so the expectation is built the same way the message is.
      message:
        `The argument ${curlyQuote('value')} must be one of: ` +
        `${curlyQuote('a')}, ${curlyQuote('b')}, ${curlyQuote('c')}. ` +
        `Received type ${curlyQuote('string')} (${curlyQuote('d')})`,
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
