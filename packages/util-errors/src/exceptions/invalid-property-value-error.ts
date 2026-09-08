// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import { assert } from '@openinf/assert';
import { curlyQuote } from '@openinf/util-text';

import { _getReceivedSubMsg } from '../_internal/_get-received-sub-msg';
import { NodeTypeError } from '../abstractions/node-type-error';

/**
 * Thrown in case an invalid or unsupported value of an object property.
 */
export class InvalidPropertyValueError extends NodeTypeError {
  /**
   * Creates an `InvalidPropertyValueError`.
   * @param objName The name of the object in question.
   * @param propName The property name assigned invalid value.
   * @param value The actual invalid property value assigned.
   * @param reason The reason for invalidity.
   */
  public constructor(
    objName: string,
    propName: string,
    value: unknown,
    reason: string = 'is invalid'
  ) {
    assert(
      typeof objName === 'string',
      `The ${curlyQuote('objName')} argument must be of type ` +
        `${curlyQuote('string')}`
    );
    assert(
      typeof propName === 'string',
      `The ${curlyQuote('propName')} argument must be of type ` +
        `${curlyQuote('string')}`
    );
    super(
      'ERR_INVALID_PROPERTY_VALUE',
      `The value for the ${curlyQuote(propName)} property of the ` +
        `${curlyQuote(objName)} object ${reason}${_getReceivedSubMsg(value)}`
    );
    this.name = 'InvalidPropertyValueError';
  }
}
