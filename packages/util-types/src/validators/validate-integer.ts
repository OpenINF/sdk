// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { hideStackFrames } from '../_internal/hide-stack-frames';

/**
 * Validates that `value` is an integer within the given range.
 * @param value The value to validate.
 * @param name The name to use in the thrown error message.
 * @param min The minimum accepted value.
 * @param max The maximum accepted value.
 * @throws {TypeError} if `value` is not a number.
 * @throws {RangeError} if `value` is not an integer, or is out of range.
 */
export const validateInteger = hideStackFrames(
  (
    value: unknown,
    name: string,
    min: number = Number.MIN_SAFE_INTEGER,
    max: number = Number.MAX_SAFE_INTEGER
  ): void => {
    if (typeof value !== 'number') {
      throw new TypeError(
        `The '${name}' argument must be of type number. Received ${typeof value}`
      );
    }
    if (!Number.isInteger(value)) {
      throw new RangeError(
        `The value of '${name}' is out of range. It must be an integer. Received ${value}`
      );
    }
    if (value < min || value > max) {
      throw new RangeError(
        `The value of '${name}' is out of range. It must be >= ${min} && <= ${max}. Received ${value}`
      );
    }
  }
);
