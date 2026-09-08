// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { curlyQuote } from '@openinf/util-text';

import { InvalidReturnValueError } from '../../src/exceptions/invalid-return-value-error';

describe(InvalidReturnValueError.name, () => {
  it('should set name and code', () => {
    const err = new InvalidReturnValueError('foo', 42, 'is invalid');
    assert.ok(err instanceof TypeError);
    assert.strictEqual(err.name, 'InvalidReturnValueError');
    assert.strictEqual(err.code, 'ERR_INVALID_RETURN_VALUE');
  });

  it('should mention the function name and reason in the message', () => {
    const err = new InvalidReturnValueError('foo', 42, 'is invalid');
    assert.ok(err.message.includes(curlyQuote('foo')));
    assert.ok(err.message.includes('is invalid'));
  });

  it('should throw when funcName is not a string', () => {
    assert.throws(
      () =>
        new InvalidReturnValueError(42 as unknown as string, 42, 'is invalid')
    );
  });
});
