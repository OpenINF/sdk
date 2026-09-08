// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isNumber, isString } from '@openinf/util-core';
import { InvalidArgTypeError, OutOfRangeError } from '@openinf/util-errors';

import { isInt32 } from '../guards/is-int32';
import { isInteger } from '../guards/is-integer';
import { assertValue } from '../helpers/assert-value';

/**
 * Detects whether an argument is a valid signed 32-bit integer within the
 * specified range.
 * @param value The actual argument value.
 * @param argName The name of the argument in question.
 * @param min The minimum accepted value.
 * @param max The maximum accepted value.
 */
export function isArgValidInt32(
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
