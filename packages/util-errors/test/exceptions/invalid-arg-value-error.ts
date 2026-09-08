// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { curlyQuote } from '@openinf/util-text';

import { InvalidArgValueError } from '../../src/exceptions/invalid-arg-value-error';

describe(InvalidArgValueError.name, () => {
  it('should set name and code', () => {
    const err = new InvalidArgValueError('foo', 42);
    assert.ok(err instanceof TypeError);
    assert.strictEqual(err.name, 'InvalidArgValueError');
    assert.strictEqual(err.code, 'ERR_INVALID_ARG_VALUE');
  });

  it('should default the reason to "is invalid"', () => {
    const err = new InvalidArgValueError('foo', 42);
    assert.ok(err.message.includes(`${curlyQuote('foo')} is invalid`));
  });

  it('should use a custom reason when given', () => {
    const err = new InvalidArgValueError('foo', 42, 'must be a string');
    assert.ok(err.message.includes(`${curlyQuote('foo')} must be a string`));
  });

  it('should throw when argName is not a string', () => {
    assert.throws(() => new InvalidArgValueError(42 as unknown as string, 42));
  });

  it('should throw when reason is not a string', () => {
    assert.throws(
      () => new InvalidArgValueError('foo', 42, 42 as unknown as string)
    );
  });
});
