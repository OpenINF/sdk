// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isFunction, isString } from '@openinf/util-core';
import { InvalidArgTypeError } from '@openinf/util-errors';

import { assertValue } from '../helpers/assert-value';

/**
 * Asserts that `value` is callable. Classes count, since they are functions.
 * @param value The argument to check.
 * @param argName The argument's name, used in the error message.
 * @throws {InvalidArgTypeError} if `value` is not a function.
 */
export function validateFunction(value: unknown, argName: string): void {
  assertValue(isString, argName);
  if (!isFunction(value))
    throw new InvalidArgTypeError(argName, 'Function', value);
}
