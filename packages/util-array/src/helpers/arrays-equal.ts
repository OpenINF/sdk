// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { EqualityComparer } from '../types';

function equateValues<T>(a: T, b: T): boolean {
  return a === b;
}

/**
 * Detects whether two arrays have the same length, holes at the same
 * indices, and equal elements everywhere else, as `equalityComparer` judges
 * equality.
 * @category Indexed Collections
 * @param a The first array.
 * @param b The second array.
 * @param equalityComparer Decides whether two elements are equal. Defaults
 * to strict equality.
 * @returns `true` if the arrays are equal; else, `false`.
 */
export function arraysEqual<T>(
  a: readonly T[],
  b: readonly T[],
  equalityComparer: EqualityComparer<T> = equateValues
): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    const aHasElement = Object.hasOwn(a, i);
    if (aHasElement !== Object.hasOwn(b, i)) {
      return false;
    }
    // Matching holes contain no values to compare. When an element exists in
    // each array, i < length guarantees both indexed accesses are present.
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint does not honor noUncheckedIndexedAccess; tsc requires these assertions.
    if (aHasElement && !equalityComparer(a[i]!, b[i]!)) {
      return false;
    }
  }

  return true;
}
