// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isNumber, isString } from '@openinf/util-core';
import { InvalidArgTypeError, OutOfRangeError } from '@openinf/util-errors';
import { isInteger, isUint32 } from '@openinf/util-number';

import { assertValue } from '../helpers/assert-value';

/**
 * Asserts that `value` is an unsigned 32-bit integer.
 * @category Type Conversion
 * @param value The argument to check.
 * @param argName The argument's name, used in the error message.
 * @param positive Whether zero is refused as well.
 * @throws {InvalidArgTypeError} if `value` is not a number.
 * @throws {OutOfRangeError} if it is not an integer, is outside the uint32
 * range, or is zero when `positive` is set.
 */
export function validateUint32(
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
