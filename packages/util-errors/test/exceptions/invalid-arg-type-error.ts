// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { curlyQuote } from '@openinf/util-text';

import { InvalidArgTypeError } from '../../src/exceptions/invalid-arg-type-error';

describe(InvalidArgTypeError.name, () => {
  it('should set name and code', () => {
    const err = new InvalidArgTypeError('foo', 'string', 42);
    assert.ok(err instanceof TypeError);
    assert.strictEqual(err.name, 'InvalidArgTypeError');
    assert.strictEqual(err.code, 'ERR_INVALID_ARG_TYPE');
  });

  it('should mention the argument name and expected type in the message', () => {
    const err = new InvalidArgTypeError('foo', 'string', 42);
    assert.ok(err.message.includes(curlyQuote('foo')));
    assert.ok(err.message.includes('string'));
  });

  it('should accept an array of expected types', () => {
    const err = new InvalidArgTypeError('foo', ['string', 'number'], true);
    assert.ok(err.message.includes('string'));
    assert.ok(err.message.includes('number'));
  });

  it('should throw when argName is not a string', () => {
    assert.throws(
      () => new InvalidArgTypeError(42 as unknown as string, 'string', 42)
    );
  });
});
