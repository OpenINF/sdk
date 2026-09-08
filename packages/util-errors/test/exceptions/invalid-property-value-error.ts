// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { curlyQuote } from '@openinf/util-text';

import { InvalidPropertyValueError } from '../../src/exceptions/invalid-property-value-error';

describe(InvalidPropertyValueError.name, () => {
  it('should set name and code', () => {
    const err = new InvalidPropertyValueError('Foo', 'bar', 42);
    assert.ok(err instanceof TypeError);
    assert.strictEqual(err.name, 'InvalidPropertyValueError');
    assert.strictEqual(err.code, 'ERR_INVALID_PROPERTY_VALUE');
  });

  it('should default the reason to "is invalid"', () => {
    const err = new InvalidPropertyValueError('Foo', 'bar', 42);
    assert.ok(err.message.includes(`${curlyQuote('bar')} property`));
    assert.ok(err.message.includes('is invalid'));
  });

  it('should use a custom reason when given', () => {
    const err = new InvalidPropertyValueError(
      'Foo',
      'bar',
      42,
      'must be a string'
    );
    assert.ok(err.message.includes('must be a string'));
  });

  it('should throw when objName is not a string', () => {
    assert.throws(
      () => new InvalidPropertyValueError(42 as unknown as string, 'bar', 42)
    );
  });
});
