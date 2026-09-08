// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isNullish } from '@openinf/util-core';

/**
 * Determines if any element is in an array.
 * @param elem The array element.
 * @param arr The array.
 * @param i The index.
 * @returns The index of the array element.
 */
export function inArray(
  elem: unknown,
  arr: unknown[] | null | undefined,
  i: number
): number {
  return isNullish(arr) ? -1 : Array.prototype.indexOf.call(arr, elem, i);
}
