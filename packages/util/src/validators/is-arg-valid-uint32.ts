// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isNumber, isString } from '@openinf/util-core';
import { InvalidArgTypeError, OutOfRangeError } from '@openinf/util-errors';

import { isInteger } from '../guards/is-integer';
import { isUint32 } from '../guards/is-uint32';
import { assertValue } from '../helpers/assert-value';

/**
 * Detects whether an argument is a valid unsigned 32-bit integer.
 * @param value The actual argument value.
 * @param argName The name of the argument in question.
 * @param positive Whether `value` must be strictly greater than zero.
 */
export function isArgValidUint32(
  value: unknown,
  argName: string,
  positive: boolean
): void {
  assertValue(isString, argName);
  if (!isUint32(value)) {
    if (!isNumber(value)) {
      throw new InvalidArgTypeError(argName, 'number', value);
    }
    if (!isInteger(value)) {
      throw new OutOfRangeError(argName, 'an integer', value);
    }
    const min = positive ? 1 : 0;
    // 2 ** 32 === 4294967296
    throw new OutOfRangeError(argName, `>= ${min} && < 4294967296`, value);
  }
  if (positive && value === 0) {
    throw new OutOfRangeError(argName, '>= 1 && < 4294967296', value);
  }
}
