// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from jQuery

/**
 * Merge the elements of two array.
 * @param first Array 1
 * @param second Array 2
 * @returns The two merged arrays.
 */
export function merge(first: unknown[], second: unknown[]): unknown[] {
  const len = +second.length;
  let j = 0,
    i = first.length;

  for (; j < len; j++) {
    first[i++] = second[j];
  }

  first.length = i;

  return first;
}
