// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js.

import { isFunction, isString } from '@openinf/util-core';
import { InvalidArgTypeError } from '@openinf/util-errors';

import { assertValue } from '../helpers/assert-value';

/**
 * Which borderline values `validateObject` accepts as an object.
 * @category Data Types and Values
 */
export interface ConformanceDescriptor {
  nullable: boolean;
  allowArray: boolean;
  allowFunction: boolean;
}

/**
 * Asserts that `value` is an object, with `null`, arrays and functions each
 * refused unless the descriptor allows them.
 * @category Data Types and Values
 * @param value The argument to check.
 * @param argName The argument's name, used in the error message.
 * @param root0 Which of the borderline cases to accept.
 * @param root0.nullable Whether `null` is accepted.
 * @param root0.allowArray Whether an array is accepted.
 * @param root0.allowFunction Whether a function is accepted.
 * @throws {InvalidArgTypeError} if `value` is not an object the descriptor
 * allows.
 */
export function validateObject(
  value: unknown,
  argName: string,
  { nullable, allowArray, allowFunction }: ConformanceDescriptor
): void {
  assertValue(isString, argName);

  if (
    (!nullable && value === null) ||
    (!allowArray && Array.isArray(value)) ||
    (typeof value !== 'object' && (!allowFunction || !isFunction(value)))
  ) {
    throw new InvalidArgTypeError(argName, 'Object', value);
  }
}
