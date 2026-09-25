// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeScript

import type { EqualityComparer } from '../types';

function equateValues<T>(a: T, b: T): boolean {
  return a === b;
}

/**
 * Detects whether `array` holds an element equal to `value`, as
 * `equalityComparer` judges equality. An `undefined` array holds nothing.
 *
 * A hole in a sparse array is read as `undefined`, so
 * `contains([, 1], undefined)` is `true`.
 * @category Indexed Collections
 * @param array The array to search.
 * @param value The value to search for.
 * @param equalityComparer Decides whether two elements are equal. Defaults
 * to strict equality.
 * @returns `true` if an equal element is found; else, `false`.
 */
export function contains<T>(
  array: readonly T[] | undefined,
  value: T,
  equalityComparer: EqualityComparer<T> = equateValues
): boolean {
  if (array) {
    for (const v of array) {
      if (equalityComparer(v, value)) {
        return true;
      }
    }
  }
  return false;
}
