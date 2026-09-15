// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { EqualityComparer } from '../types';

/**
 * Compares two values with strict equality (`===`).
 * @category Testing and Comparison Operations
 * @param a The first value.
 * @param b The second value.
 * @returns `true` if `a === b`; else, `false`.
 */
export function equateValues<T>(a: T, b: T): boolean {
  return a === b;
}

/**
 * Detects whether every element of `array` equals its first element, as
 * `comparer` judges equality.
 * @category Indexed Collections
 * @param array The array to inspect.
 * @param comparer Decides whether two elements are equal. Defaults to
 * `equateValues`.
 * @returns `true` if every element equals the first, or if `array` has
 * fewer than two elements; else, `false`.
 */
export function arrayIsHomogeneous<T>(
  array: readonly T[],
  comparer: EqualityComparer<T> = equateValues
): boolean {
  if (array.length < 2) return true;
  // length >= 2 guarantees index 0 and every index in the loop are present.
  // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
  const first = array[0]!;
  for (let i = 1, length = array.length; i < length; i++) {
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
    const target = array[i]!;
    if (!comparer(first, target)) return false;
  }
  return true;
}
