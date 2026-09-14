// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isNumber, isString } from '@openinf/util-core';
import { InvalidArgTypeError, OutOfRangeError } from '@openinf/util-errors';

import { isInt32 } from '../guards/is-int32';
import { isInteger } from '../guards/is-integer';
import { assertValue } from '../helpers/assert-value';

/**
 * Asserts that `value` is a signed 32-bit integer between `min` and `max`.
 * @param value The argument to check.
 * @param argName The argument's name, used in the error message.
 * @param min The smallest value accepted, by default the int32 minimum.
 * @param max The largest value accepted, by default the int32 maximum.
 * @throws {InvalidArgTypeError} if `value` is not a number.
 * @throws {OutOfRangeError} if it is not an integer, or is outside the range.
 */
export function validateInt32(
  value: unknown,
  argName: string,
  min = -2147483648,
  max = 2147483647
): void {
  assertValue(isString, argName);
  assertValue(isInteger, min);
  assertValue(isInteger, max);
  // The defaults for min and max correspond to the limits of 32-bit integers.
  if (!isInt32(value)) {
    if (!isNumber(value)) {
      throw new InvalidArgTypeError(argName, 'number', value);
    }
    if (!isInteger(value)) {
      throw new OutOfRangeError(argName, 'an integer', value);
    }
    throw new OutOfRangeError(argName, `>= ${min} && <= ${max}`, value);
  }
  if (value < min || value > max) {
    throw new OutOfRangeError(argName, `>= ${min} && <= ${max}`, value);
  }
}
