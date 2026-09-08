// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import { assert } from '@openinf/assert';
import { curlyQuote } from '@openinf/util-text';

import { _getReceivedSubMsg } from '../_internal/_get-received-sub-msg';
import { NodeTypeError } from '../abstractions/node-type-error';

/**
 * Thrown in case a function does not provide a valid value for one of
 * its returned object properties on execution.
 * @see https://nodejs.org/api/errors.html#ERR_INVALID_RETURN_PROPERTY
 */
export class InvalidReturnPropertyValueError extends NodeTypeError {
  /**
   * Creates an `InvalidReturnPropertyValueError`.
   * @param funcName The name of the function returning the invalidity.
   * @param propName The property name assigned the invalid value.
   * @param value The actual invalid property value assigned.
   * @param reason The reason for invalidity.
   */
  public constructor(
    funcName: string,
    propName: string,
    value: unknown,
    reason: string = 'is invalid'
  ) {
    assert(
      typeof funcName === 'string',
      `The ${curlyQuote('funcName')} argument must be of type ` +
        `${curlyQuote('string')}`
    );
    assert(
      typeof propName === 'string',
      `The ${curlyQuote('propName')} argument must be of type ` +
        `${curlyQuote('string')}`
    );
    super(
      'ERR_INVALID_RETURN_PROPERTY_VALUE',
      `The value of the ${curlyQuote(propName)} property ` +
        `returned by the ${curlyQuote(
          funcName
        )} function ${reason}${_getReceivedSubMsg(value)}`
    );
    this.name = 'InvalidReturnPropertyValueError';
  }
}
