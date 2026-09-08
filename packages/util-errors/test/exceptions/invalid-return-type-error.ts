// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { curlyQuote } from '@openinf/util-text';

import { InvalidReturnTypeError } from '../../src/exceptions/invalid-return-type-error';

describe(InvalidReturnTypeError.name, () => {
  it('should set name and code', () => {
    const err = new InvalidReturnTypeError('foo', 'string', 42);
    assert.ok(err instanceof TypeError);
    assert.strictEqual(err.name, 'InvalidReturnTypeError');
    assert.strictEqual(err.code, 'ERR_INVALID_RETURN_TYPE');
  });

  it('should mention the function name in the message', () => {
    const err = new InvalidReturnTypeError('foo', 'string', 42);
    assert.ok(err.message.includes(curlyQuote('foo')));
  });

  it('should throw when funcName is not a string', () => {
    assert.throws(
      () => new InvalidReturnTypeError(42 as unknown as string, 'string', 42)
    );
  });
});
