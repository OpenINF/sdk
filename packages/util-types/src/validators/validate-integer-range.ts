// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Deno

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
