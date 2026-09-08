// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Lodash

import { eq } from '../_internal/_eq';

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 * @private
 * @param array The array to inspect.
 * @param key The key to search for.
 * @returns Returns the index of the matched value, else `-1`.
 */
export function assocIndexOf(array: unknown[][], key: PropertyKey): number {
  let length = array.length;

  while (length--) {
    // `while (length--)` only ever visits indices already within bounds.
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
    if (eq(array[length]![0], key)) {
      return length;
    }
  }

  return -1;
}
