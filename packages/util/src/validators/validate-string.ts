// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isString } from '@openinf/util-core';
import { InvalidArgTypeError } from '@openinf/util-errors';

import { assertValue } from '../helpers/assert-value';

/**
 * Asserts that `value` is a string primitive. A `String` object is refused.
 * @param value The argument to check.
 * @param argName The argument's name, used in the error message.
 * @throws {InvalidArgTypeError} if `value` is not a string.
 */
export function validateString(value: unknown, argName: string): void {
  assertValue(isString, argName);
  if (!isString(value)) throw new InvalidArgTypeError(argName, 'string', value);
}
