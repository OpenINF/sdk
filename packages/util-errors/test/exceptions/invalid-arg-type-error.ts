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

  it('should list three or more expected types without extra quoting', () => {
    const types = new InvalidArgTypeError(
      'foo',
      ['string', 'number', 'boolean'],
      null
    );
    assert.ok(
      types.message.includes(
        `one of type ${curlyQuote('string')}, ${curlyQuote('number')}, ` +
          `or ${curlyQuote('boolean')}.`
      ),
      types.message
    );

    const instances = new InvalidArgTypeError(
      'foo',
      ['Buffer', 'Uint8Array', 'DataView'],
      null
    );
    assert.ok(
      instances.message.includes(
        `an instance of ${curlyQuote('Buffer')}, ${curlyQuote('Uint8Array')}, ` +
          `or ${curlyQuote('DataView')}.`
      ),
      instances.message
    );

    const other = new InvalidArgTypeError('foo', ['a b', 'c d', 'e f'], null);
    assert.ok(
      other.message.includes(
        `one of ${curlyQuote('a b')}, ${curlyQuote('c d')}, ` +
          `or ${curlyQuote('e f')}.`
      ),
      other.message
    );
  });

  it('should keep terminal escape codes out of the message', (t) => {
    // The message used to italicize "must" whenever stdout was a terminal, so
    // a message logged to a file or compared in a test depended on where the
    // process happened to be running.
    // `isTTY` is only an own property when stdout is a terminal, so it is
    // defined here and its original descriptor, if any, put back afterwards.
    const isTTY = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');
    Object.defineProperty(process.stdout, 'isTTY', {
      configurable: true,
      value: true,
    });
    const term = process.env['TERM'];
    process.env['TERM'] = 'xterm-256color';
    t.after(() => {
      if (isTTY === undefined) Reflect.deleteProperty(process.stdout, 'isTTY');
      else Object.defineProperty(process.stdout, 'isTTY', isTTY);
      if (term === undefined) delete process.env['TERM'];
      else process.env['TERM'] = term;
    });

    const err = new InvalidArgTypeError('foo', 'string', 42);
    assert.doesNotMatch(err.message, /\u001B/);
    assert.ok(err.message.includes(' argument must be '), err.message);
  });

  it('should throw when argName is not a string', () => {
    assert.throws(
      () => new InvalidArgTypeError(42 as unknown as string, 'string', 42)
    );
  });
});
