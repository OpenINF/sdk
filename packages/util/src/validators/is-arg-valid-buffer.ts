// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isString } from '@openinf/util-core';
import { InvalidArgTypeError } from '@openinf/util-errors';

import { assertValue } from '../helpers/assert-value';

/**
 * Asserts that `buffer` is a `Buffer`, `TypedArray`, or `DataView`.
 *
 * Takes `unknown` rather than `Buffer`: the whole point is to check a value
 * whose type is not yet known, so requiring the caller to already have a
 * `Buffer` would defeat it.
 * @param buffer The value to validate.
 * @param argName The argument name to report in the error message.
 * @throws {InvalidArgTypeError} if `buffer` is not buffer-like.
 */
export function isArgValidBuffer(
  buffer: unknown,
  argName: string = 'buffer'
): void {
  assertValue(isString, argName);
  if (!ArrayBuffer.isView(buffer)) {
    throw new InvalidArgTypeError(
      argName,
      ['Buffer', 'TypedArray', 'DataView'],
      buffer
    );
  }
}
