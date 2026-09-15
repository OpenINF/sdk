// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// https://github.com/walkwel-tech/firebase-js-sdk/blob/3a4c3146ccfb3450988c1ef0a9b4d472e38f9304/src/database/common/util/validation.js#L18

import { isString } from '@openinf/util-core';
import { InvalidArgsNumberError } from '@openinf/util-errors';
import { isInteger, type Integer } from '@openinf/util-number';

import { assertValue } from '../helpers/assert-value';

/**
 * Asserts that a function was called with between `minCount` and `maxCount`
 * arguments.
 * @category Fundamental Objects
 * @param fnName The function's name, used in the error message.
 * @param minCount The fewest arguments the function accepts.
 * @param maxCount The most arguments the function accepts.
 * @param argCount How many it was actually given.
 * @throws {InvalidArgsNumberError} if `argCount` falls outside the range.
 */
export function validateArgCount(
  fnName: string,
  minCount: Integer,
  maxCount: Integer,
  argCount: Integer
): void {
  assertValue(isString, fnName, 'fnName');
  assertValue(isInteger, minCount, 'minCount');
  assertValue(isInteger, maxCount, 'maxCount');
  assertValue(isInteger, argCount, 'maxCount');
  // Report whichever bound was actually violated as the expected count.
  let expected: number | undefined;
  if (Number(argCount) < Number(minCount)) {
    expected = Number(minCount);
  } else if (Number(argCount) > Number(maxCount)) {
    expected = Number(maxCount);
  }
  if (expected !== undefined) {
    throw new InvalidArgsNumberError(fnName, expected, Number(argCount));
  }
}
