// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import { assert } from '@openinf/assert';
import { curlyQuote } from '@openinf/util-text';

import { _getInvalidTypeSubMsg } from '../_internal/_get-invalid-type-sub-msg';
import { NodeTypeError } from '../abstractions/node-type-error';

/**
 * Thrown in case an invalid or unsupported value type for an object property.
 */
export class InvalidPropertyTypeError extends NodeTypeError {
  /**
   * Creates an `InvalidPropertyTypeError`.
   * @param objName The name of the object in question.
   * @param propName The property name assigned value of invalid type.
   * @param expected The property type(s) expected.
   * @param value The actual property value of invalid type assigned.
   */
  public constructor(
    objName: string,
    propName: string,
    expected: string[] | string,
    value: unknown
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
      'ERR_INVALID_PROPERTY_TYPE',
      `The ${curlyQuote(propName)} property of the ${curlyQuote(objName)} ` +
        `object must be ` +
        _getInvalidTypeSubMsg(expected, value)
    );
    this.name = 'InvalidPropertyTypeError';
  }
}
