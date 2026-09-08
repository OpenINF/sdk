// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import { assert } from '@openinf/assert';
import { curlyQuote, italicize } from '@openinf/util-text';

import { _getInvalidTypeSubMsg } from '../_internal/_get-invalid-type-sub-msg';
import { NodeTypeError } from '../abstractions/node-type-error';

export class InvalidArgTypeError extends NodeTypeError {
  /**
   * Thrown in case an argument of the wrong type was passed for a given argument.
   * @see https://nodejs.org/api/errors.html#InvalidArgTypeError
   * @param argName The name of the argument of invalid type.
   * @param expected The argument type(s) expected.
   * @param value The actual argument value of invalid type.
   */
  public constructor(
    argName: string,
    expected: string[] | string,
    value: unknown
  ) {
    assert(
      typeof argName === 'string',
      `The ${curlyQuote('argName')} argument ${italicize('must')} be of type ` +
        `${curlyQuote('string')}`
    );
    super(
      'ERR_INVALID_ARG_TYPE',
      // `_getInvalidTypeSubMsg` already renders the expected type(s) -- as
      // "of type X", "one of X or Y", or "an instance of X" -- so naming them
      // again here produced "must be string.of type 'string'".
      `The ${curlyQuote(argName)} argument ${italicize('must')} be ` +
        `${_getInvalidTypeSubMsg(expected, value)}`
    );
    this.name = 'InvalidArgTypeError';
  }
}

// TODO(kt3k): Needs to handle "types" and "instances" differently.
// See the link below for details:
// https://github.com/nodejs/node/blob/f3eb224/lib/internal/errors.js#L1037-L1087
