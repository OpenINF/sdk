// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { curlyQuote } from '@openinf/util-text';

import { MissingOptionError } from '../../src/exceptions/missing-option-error';

describe(MissingOptionError.name, () => {
  it('should set name and code', () => {
    const err = new MissingOptionError('foo');
    assert.ok(err instanceof TypeError);
    assert.strictEqual(err.name, 'MissingOptionError');
    assert.strictEqual(err.code, 'ERR_MISSING_OPTION');
  });

  it('should mention the option name in the message', () => {
    const err = new MissingOptionError('foo');
    assert.strictEqual(
      err.message,
      `${curlyQuote('foo')} is a missing option that is required`
    );
  });

  it('should throw when optName is not a string', () => {
    assert.throws(() => new MissingOptionError(42 as unknown as string));
  });
});
