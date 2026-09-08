// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import { assert } from '@openinf/assert';
import { curlyQuote } from '@openinf/util-text';

import { _getReceivedSubMsg } from '../_internal/_get-received-sub-msg';
import { NodeTypeError } from '../abstractions/node-type-error';

export class InvalidArgValueError extends NodeTypeError {
  /**
   * Thrown in case an invalid or unsupported value was passed for a given
   * argument.
   * @see https://nodejs.org/api/errors.html#ERR_INVALID_ARG_VALUE
   * @param argName The argument name.
   * @param value The actual invalid argument value.
   * @param reason The reason for invalidity.
   */
  public constructor(
    argName: string,
    value: unknown,
    reason: string = 'is invalid'
  ) {
    assert(
      typeof argName === 'string',
      `The ${curlyQuote('argName')} argument must be of type ` +
        `${curlyQuote('string')}`
    );
    assert(
      typeof reason === 'string',
      `The ${curlyQuote('reason')} argument must be of type ` +
        `${curlyQuote('string')}`
    );
    super(
      'ERR_INVALID_ARG_VALUE',
      `The argument ${curlyQuote(argName)} ${reason}${_getReceivedSubMsg(
        value
      )}`
    );
    this.name = 'InvalidArgValueError';
  }
}

// `The argument '${name}' ${reason}. Received ${inspect(value)}`.
