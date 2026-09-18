// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isString } from '@openinf/util-core';
import { InvalidArgValueError } from '@openinf/util-errors';
import { curlyQuote } from '@openinf/util-text';

import { assertValue } from '../helpers/assert-value';

/**
 * Quotes a string the way the error messages do, and leaves the rest.
 * @param value The value to describe.
 * @returns The value as it should read in a message.
 */
function describe(value: unknown): string {
  return isString(value) ? curlyQuote(value) : String(value);
}

/**
 * Asserts that `value` is one of the values in `oneOf`, compared with
 * `Array.prototype.includes`, which counts `NaN` as equal to itself.
 * @category Testing and Comparison Operations
 * @param value The argument to check.
 * @param argName The argument's name, used in the error message.
 * @param oneOf The values accepted.
 * @throws {InvalidArgValueError} if `value` is none of them.
 */
export function validateOneOf(
  value: unknown,
  argName: string,
  oneOf: readonly unknown[]
): void {
  assertValue(isString, argName);

  if (!oneOf.includes(value)) {
    throw new InvalidArgValueError(
      argName,
      value,
      `must be one of: ${oneOf.map(describe).join(', ')}`
    );
  }
}
