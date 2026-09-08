// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// https://github.com/walkwel-tech/firebase-js-sdk/blob/3a4c3146ccfb3450988c1ef0a9b4d472e38f9304/src/database/common/util/validation.js#L18

import { isString } from '@openinf/util-core';
import { InvalidArgsNumberError } from '@openinf/util-errors';

import { isInteger } from '../guards/is-integer';
import type { Integer } from '../guards/is-integer';
import { assertValue } from '../helpers/assert-value';

/**
 * Check to make sure the appropriate number of arguments are provided for a
 * public function.
 *
 * Throws an error if it fails.
 * @param fnName The function name.
 * @param minCount The minimum number of arguments to allow for the function call.
 * @param maxCount The maximum number of argument to allow for the function call.
 * @param argCount The actual number of arguments provided.
 */
export function isArgCountValid(
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
