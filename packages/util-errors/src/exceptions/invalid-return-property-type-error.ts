// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import { assert } from '@openinf/assert';
import { curlyQuote } from '@openinf/util-text';

import { _getInvalidTypeSubMsg } from '../_internal/_get-invalid-type-sub-msg';
import { NodeTypeError } from '../abstractions/node-type-error';

/**
 * Thrown in case a function does not provide an expected value type for
 * one of its returned object properties on execution.
 * @see https://nodejs.org/api/errors.html#ERR_INVALID_RETURN_PROPERTY_VALUE
 */
export class InvalidReturnPropertyTypeError extends NodeTypeError {
  /**
   * Creates an `InvalidReturnPropertyTypeError`.
   * @param funcName The name of the function returning the invalidity.
   * @param propName The property name assigned value of invalid type.
   * @param expected The property type(s) expected.
   * @param value The actual property value of invalid type assigned.
   */
  public constructor(
    funcName: string,
    propName: string,
    expected: string[] | string,
    value: unknown
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
      'ERR_INVALID_RETURN_PROPERTY_TYPE',
      `The ${curlyQuote(propName)} property returned by the ` +
        `${curlyQuote(funcName)} function must be ` +
        _getInvalidTypeSubMsg(expected, value)
    );
    this.name = 'InvalidReturnPropertyTypeError';
  }
}
