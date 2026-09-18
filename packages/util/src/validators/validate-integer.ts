// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isNumber, isString } from '@openinf/util-core';
import { InvalidArgTypeError, OutOfRangeError } from '@openinf/util-errors';
import { isInteger } from '@openinf/util-number';

import { assertValue } from '../helpers/assert-value';

/**
 * Asserts that `value` is an integer between `min` and `max`, which default to
 * the safe integer range.
 * @category Numbers and Dates
 * @param value The argument to check.
 * @param argName The argument's name, used in the error message.
 * @param min The smallest value accepted.
 * @param max The largest value accepted.
 * @throws {InvalidArgTypeError} if `value` is not a number.
 * @throws {OutOfRangeError} if it is not an integer, or is outside the range.
 */
export function validateInteger(
  value: unknown,
  argName: string,
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
): void {
  assertValue(isString, argName);
  assertValue(isInteger, min);
  assertValue(isInteger, max);

  if (!isNumber(value)) {
    throw new InvalidArgTypeError(argName, 'number', value);
  }
  if (!isInteger(value)) {
    throw new OutOfRangeError(argName, 'an integer', value);
  }
  if (value < min || value > max) {
    throw new OutOfRangeError(argName, `>= ${min} && <= ${max}`, value);
  }
}
