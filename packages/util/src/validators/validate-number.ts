// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isNumber, isString } from '@openinf/util-core';
import { InvalidArgTypeError } from '@openinf/util-errors';

import { assertValue } from '../helpers/assert-value';

/**
 * Asserts that `value` is a number primitive. A `Number` object is refused.
 *
 * `NaN` passes, since it is a number; use `validateInt32` or `validateUint32`
 * where the value also has to be a usable integer.
 * @category Data Types and Values
 * @param value The argument to check.
 * @param argName The argument's name, used in the error message.
 * @throws {InvalidArgTypeError} if `value` is not a number.
 */
export function validateNumber(value: unknown, argName: string): void {
  assertValue(isString, argName);
  if (!isNumber(value)) throw new InvalidArgTypeError(argName, 'number', value);
}
