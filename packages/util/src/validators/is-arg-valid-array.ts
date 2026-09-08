// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isArray, isString } from '@openinf/util-core';
import {
  InvalidArgTypeError,
  InvalidArgValueError,
} from '@openinf/util-errors';

import { isLength } from '../guards/is-length';
import { assertValue } from '../helpers/assert-value';

/**
 * Detects whether an array argument conforms to specified validity
 * parameters.
 * @param value The actual argument value.
 * @param argName The name of the argument in question.
 * @param minLength The minimum length of the array.
 * @throws { InvalidArgTypeError } if `value` is not an Array.
 * @throws { InvalidArgValueError } if the array length of `value` is less than
 * specified by `minLength`.
 */
export function isArgValidArray(
  value: unknown,
  argName: string,
  minLength: number
): void {
  assertValue(isString, argName);
  assertValue(isLength, minLength);
  if (!isArray(value)) throw new InvalidArgTypeError(argName, 'Array', value);
  if (value.length < minLength) {
    const reason = `must be longer than ${minLength}`;
    throw new InvalidArgValueError(argName, value, reason);
  }
}
