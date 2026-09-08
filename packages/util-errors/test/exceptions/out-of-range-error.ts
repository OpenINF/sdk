// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { curlyQuote } from '@openinf/util-text';

import { OutOfRangeError } from '../../src/exceptions/out-of-range-error';

describe(OutOfRangeError.name, () => {
  it('should set name and code', () => {
    const err = new OutOfRangeError('foo', '>= 0', -1);
    assert.ok(err instanceof RangeError);
    assert.strictEqual(err.name, 'OutOfRangeError');
    assert.strictEqual(err.code, 'ERR_OUT_OF_RANGE');
  });

  it('should mention the value name and range in the message', () => {
    const err = new OutOfRangeError('foo', '>= 0', -1);
    assert.ok(err.message.includes(curlyQuote('foo')));
    assert.ok(err.message.includes('>= 0'));
    assert.ok(err.message.includes('Received -1'));
  });

  it('should replace the default message when replaceDefaultBoolean is true', () => {
    const err = new OutOfRangeError('custom message', '>= 0', -1, true);
    assert.ok(err.message.includes('custom message'));
  });

  it('should add numerical separators to large integers', () => {
    const err = new OutOfRangeError('foo', '>= 0', 2 ** 32 + 1);
    assert.ok(err.message.includes('Received 4_294_967_297'));
  });

  it('should format bigint values with a trailing n', () => {
    const err = new OutOfRangeError('foo', '>= 0', BigInt(5));
    assert.ok(err.message.includes('Received 5n'));
  });

  it('should add numerical separators to large bigint values', () => {
    const err = new OutOfRangeError('foo', '>= 0', 2n ** 32n + 1n);
    assert.ok(err.message.includes('Received 4_294_967_297n'));
  });

  it('should throw when range is empty', () => {
    assert.throws(() => new OutOfRangeError('foo', '', -1));
  });
});
