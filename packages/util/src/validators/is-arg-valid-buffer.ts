// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isString } from '@openinf/util-core';
import { InvalidArgTypeError } from '@openinf/util-errors';

import { assertValue } from '../helpers/assert-value';

/**
 * Asserts that `buffer` is a `Buffer`, `TypedArray`, or `DataView`.
 *
 * The name follows Node's usage, where an argument called `buffer` means any
 * view over bytes rather than a `Buffer` in particular: `fs.read` and its
 * neighbors all document theirs as `Buffer | TypedArray | DataView` and accept
 * a `Uint8Array`. So does this. For the narrower question of whether a value
 * is a Node `Buffer` specifically, which is what unlocks methods like
 * `toString('utf8')` that a plain `Uint8Array` does not have, use `isBuffer`.
 *
 * A bare `ArrayBuffer` is refused either way. It holds the bytes but is not a
 * view onto them, and has no way to read one.
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
