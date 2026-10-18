// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from jQuery

/**
 * Appends the elements of `second` to `first`, in place.
 * @category Indexed Collections
 * @param first The array to append to.
 * @param second The array whose elements are appended.
 * @returns `first`.
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
