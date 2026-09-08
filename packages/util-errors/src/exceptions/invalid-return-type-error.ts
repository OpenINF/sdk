// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import { assert } from '@openinf/assert';
import { curlyQuote } from '@openinf/util-text';

import { _getInvalidTypeSubMsg } from '../_internal/_get-invalid-type-sub-msg';
import { NodeTypeError } from '../abstractions/node-type-error';

/**
 * Thrown in case a function does not return an expected value type on
 * execution, such as when a function is expected to return a promise.
 * @see https://nodejs.org/api/errors.html#ERR_INVALID_RETURN_VALUE
 */
export class InvalidReturnTypeError extends NodeTypeError {
  /**
   * Creates an `InvalidReturnTypeError`.
   * @param funcName The name of the function returning the invalidity.
   * @param expected The return type(s) expected.
   * @param value The actual value of invalid type returned.
   */
  public constructor(
    funcName: string,
    expected: string[] | string,
    value: unknown
  ) {
    assert(
      typeof funcName === 'string',
      `The ${curlyQuote('funcName')} argument must be of type ` +
        `${curlyQuote('string')}`
    );
    super(
      'ERR_INVALID_RETURN_TYPE',
      `The value returned by the ${curlyQuote(funcName)} function ` +
        `must be ${_getInvalidTypeSubMsg(expected, value)}`
    );
    this.name = 'InvalidReturnTypeError';
  }
}
