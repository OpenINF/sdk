// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { curlyQuote } from '@openinf/util-text';

import { InvalidReturnPropertyTypeError } from '../../src/exceptions/invalid-return-property-type-error';

describe(InvalidReturnPropertyTypeError.name, () => {
  it('should set name and code', () => {
    const err = new InvalidReturnPropertyTypeError('foo', 'bar', 'string', 42);
    assert.ok(err instanceof TypeError);
    assert.strictEqual(err.name, 'InvalidReturnPropertyTypeError');
    assert.strictEqual(err.code, 'ERR_INVALID_RETURN_PROPERTY_TYPE');
  });

  it('should mention the property and function names in the message', () => {
    const err = new InvalidReturnPropertyTypeError('foo', 'bar', 'string', 42);
    assert.ok(err.message.includes(curlyQuote('bar')));
    assert.ok(err.message.includes(curlyQuote('foo')));
  });

  it('should throw when funcName is not a string', () => {
    assert.throws(
      () =>
        new InvalidReturnPropertyTypeError(
          42 as unknown as string,
          'bar',
          'string',
          42
        )
    );
  });
});
