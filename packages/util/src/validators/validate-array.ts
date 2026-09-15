// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isArray, isString } from '@openinf/util-core';
import {
  InvalidArgTypeError,
  InvalidArgValueError,
} from '@openinf/util-errors';
import { isLength } from '@openinf/util-number';

import { assertValue } from '../helpers/assert-value';

/**
 * Asserts that `value` is an array holding at least `minLength` elements.
 * @category Indexed Collections
 * @param value The argument to check.
 * @param argName The argument's name, used in the error message.
 * @param minLength The fewest elements the array may hold.
 * @throws {InvalidArgTypeError} if `value` is not an array.
 * @throws {InvalidArgValueError} if it holds fewer than `minLength` elements.
 */
export function validateArray(
  value: unknown,
  argName: string,
  minLength: number
): void {
  assertValue(isString, argName);
  assertValue(isLength, minLength);
  if (!isArray(value)) throw new InvalidArgTypeError(argName, 'Array', value);
  if (value.length < minLength) {
    // Node's wording, which it moved to from "must be longer than": the bound
    // is inclusive, and an array holding exactly `minLength` elements passes.
    const reason = `must have a length of at least ${minLength}`;
    throw new InvalidArgValueError(argName, value, reason);
  }
}
