// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { curlyQuote } from '@openinf/util-text';

import { MissingArgsError } from '../../src/exceptions/missing-args-error';

describe(MissingArgsError.name, () => {
  it('should set name and code', () => {
    const err = new MissingArgsError('foo');
    assert.ok(err instanceof TypeError);
    assert.strictEqual(err.name, 'MissingArgsError');
    assert.strictEqual(err.code, 'ERR_MISSING_ARGS');
  });

  it('should format a single argument name', () => {
    const err = new MissingArgsError('foo');
    assert.strictEqual(
      err.message,
      `The ${curlyQuote('foo')} argument must be specified`
    );
  });

  it('should format two argument names joined by "and"', () => {
    const err = new MissingArgsError('foo', 'bar');
    assert.strictEqual(
      err.message,
      `The ${curlyQuote('foo')} and ${curlyQuote(
        'bar'
      )} arguments must be specified`
    );
  });

  it('should format three or more argument names as a comma-separated list', () => {
    const err = new MissingArgsError('foo', 'bar', 'baz');
    assert.strictEqual(
      err.message,
      `The ${curlyQuote('foo')}, ${curlyQuote('bar')}, and ${curlyQuote(
        'baz'
      )} arguments must be specified`
    );
  });

  it('should throw when called with no arguments', () => {
    assert.throws(() => new MissingArgsError());
  });
});
