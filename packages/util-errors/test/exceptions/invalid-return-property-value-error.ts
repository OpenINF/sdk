// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { curlyQuote } from '@openinf/util-text';

import { InvalidReturnPropertyValueError } from '../../src/exceptions/invalid-return-property-value-error';

describe(InvalidReturnPropertyValueError.name, () => {
  it('should set name and code', () => {
    const err = new InvalidReturnPropertyValueError('foo', 'bar', 42);
    assert.ok(err instanceof TypeError);
    assert.strictEqual(err.name, 'InvalidReturnPropertyValueError');
    assert.strictEqual(err.code, 'ERR_INVALID_RETURN_PROPERTY_VALUE');
  });

  it('should default the reason to "is invalid"', () => {
    const err = new InvalidReturnPropertyValueError('foo', 'bar', 42);
    assert.ok(err.message.includes(curlyQuote('bar')));
    assert.ok(err.message.includes('is invalid'));
  });

  it('should use a custom reason when given', () => {
    const err = new InvalidReturnPropertyValueError(
      'foo',
      'bar',
      42,
      'must be a string'
    );
    assert.ok(err.message.includes('must be a string'));
  });

  it('should throw when funcName is not a string', () => {
    assert.throws(
      () =>
        new InvalidReturnPropertyValueError(42 as unknown as string, 'bar', 42)
    );
  });
});
