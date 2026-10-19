// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isNullish } from '@openinf/util-core';

/**
 * Finds the index of `elem` in `arr`, searching from index `i`.
 * @category Indexed Collections
 * @param elem The element to search for.
 * @param arr The array to search.
 * @param i The index to start searching from.
 * @returns The index of `elem`, or `-1` if it is absent or `arr` is nullish.
 */
export function inArray(
  elem: unknown,
  arr: unknown[] | null | undefined,
  i: number
): number {
  return isNullish(arr) ? -1 : Array.prototype.indexOf.call(arr, elem, i);
}
