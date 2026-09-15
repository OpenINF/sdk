// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isBoolean, isString } from '@openinf/util-core';
import { InvalidArgTypeError } from '@openinf/util-errors';

import { assertValue } from '../helpers/assert-value';

/**
 * Asserts that `value` is a boolean primitive. A `Boolean` object is refused.
 * @category Data Types and Values
 * @param value The argument to check.
 * @param argName The argument's name, used in the error message.
 * @throws {InvalidArgTypeError} if `value` is not a boolean.
 */
export function validateBoolean(value: unknown, argName: string): void {
  assertValue(isString, argName);
  if (!isBoolean(value))
    throw new InvalidArgTypeError(argName, 'boolean', value);
}
