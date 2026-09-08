// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import { assert } from '@openinf/assert';
import { curlyQuote } from '@openinf/util-text';

import { _getReceivedSubMsg } from '../_internal/_get-received-sub-msg';
import { NodeTypeError } from '../abstractions/node-type-error';

/**
 * Thrown in case a function does not return an expected valid value on
 * execution.
 * @see https://nodejs.org/api/errors.html#ERR_INVALID_RETURN_VALUE
 */
export class InvalidReturnValueError extends NodeTypeError {
  /**
   * Creates an `InvalidReturnValueError`.
   * @param funcName The name of the function returning the invalidity.
   * @param value The actual invalid value returned.
   * @param reason The reason for invalidity.
   */
  public constructor(funcName: string, value: unknown, reason: string) {
    assert(
      typeof funcName === 'string',
      `The ${curlyQuote('funcName')} argument must be of type ` +
        `${curlyQuote('string')}`
    );
    super(
      'ERR_INVALID_RETURN_VALUE',
      `The value returned by the ${curlyQuote(funcName)} ` +
        `function ${reason}${_getReceivedSubMsg(value)}`
    );
    this.name = 'InvalidReturnValueError';
  }
}
