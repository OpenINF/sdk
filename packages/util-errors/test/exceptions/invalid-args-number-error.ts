// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { curlyQuote } from '@openinf/util-text';

import { InvalidArgsNumberError } from '../../src/exceptions/invalid-args-number-error';

describe(InvalidArgsNumberError.name, () => {
  it('should set name, code, and a descriptive message', () => {
    const err = new InvalidArgsNumberError('foo', 2, 3);
    assert.ok(err instanceof TypeError);
    assert.strictEqual(err.name, 'InvalidArgsNumberError');
    assert.strictEqual(err.code, 'ERR_INVALID_ARGS_NUMBER');
    assert.strictEqual(
      err.message,
      `The number of arguments expected by the ${curlyQuote(
        'foo'
      )} function is 2, but 3 were passed`
    );
  });

  it('should throw an AssertionError when funcName is not a string', () => {
    assert.throws(
      () => new InvalidArgsNumberError(42 as unknown as string, 2, 3)
    );
  });

  it('should throw an AssertionError when expected is not a number', () => {
    assert.throws(
      () => new InvalidArgsNumberError('foo', '2' as unknown as number, 3)
    );
  });

  it('should throw an AssertionError when value is not a number', () => {
    assert.throws(
      () => new InvalidArgsNumberError('foo', 2, '3' as unknown as number)
    );
  });
});
