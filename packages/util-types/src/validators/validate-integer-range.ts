// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Deno

/**
 * Asserts that `value` is an integer between `min` and `max`, which default
 * to the limits of a signed 32-bit integer.
 * @category Numbers and Dates
 * @param value The value to check.
 * @param name The name of the value, used in the error message.
 * @param min The smallest value allowed.
 * @param max The largest value allowed.
 * @throws {Error} if `value` is not an integer, or is outside the range.
 */
export function validateIntegerRange(
  value: number,
  name: string,
  min = -2147483648,
  max = 2147483647
): void {
  // The defaults for min and max correspond to the limits of 32-bit integers.
  if (!Number.isInteger(value)) {
    throw new Error(`${name} must be 'an integer' but was ${value}`);
  }

  if (value < min || value > max) {
    throw new Error(
      `${name} must be >= ${min} && <= ${max}. Value was ${value}`
    );
  }
}
