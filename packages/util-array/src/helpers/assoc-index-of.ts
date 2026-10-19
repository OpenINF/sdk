// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Lodash

import { eq } from '../_internal/_eq';

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 * An entry that is not an array, such as a hole or `null`, matches nothing.
 * @category Indexed Collections
 * @param array The array to inspect.
 * @param key The key to search for.
 * @returns Returns the index of the matched value, else `-1`.
 */
export function assocIndexOf(array: unknown[][], key: PropertyKey): number {
  let length = array.length;

  while (length--) {
    const entry = array[length];
    if (Array.isArray(entry) && eq(entry[0], key)) {
      return length;
    }
  }

  return -1;
}
