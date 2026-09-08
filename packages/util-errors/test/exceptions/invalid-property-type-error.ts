// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { curlyQuote } from '@openinf/util-text';

import { InvalidPropertyTypeError } from '../../src/exceptions/invalid-property-type-error';

describe(InvalidPropertyTypeError.name, () => {
  it('should set name and code', () => {
    const err = new InvalidPropertyTypeError('Foo', 'bar', 'string', 42);
    assert.ok(err instanceof TypeError);
    assert.strictEqual(err.name, 'InvalidPropertyTypeError');
    assert.strictEqual(err.code, 'ERR_INVALID_PROPERTY_TYPE');
  });

  it('should mention the property and object names in the message', () => {
    const err = new InvalidPropertyTypeError('Foo', 'bar', 'string', 42);
    assert.ok(err.message.includes(curlyQuote('bar')));
    assert.ok(err.message.includes(curlyQuote('Foo')));
  });

  it('should throw when objName is not a string', () => {
    assert.throws(
      () =>
        new InvalidPropertyTypeError(
          42 as unknown as string,
          'bar',
          'string',
          42
        )
    );
  });

  it('should throw when propName is not a string', () => {
    assert.throws(
      () =>
        new InvalidPropertyTypeError(
          'Foo',
          42 as unknown as string,
          'string',
          42
        )
    );
  });
});
