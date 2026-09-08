// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _equateValues } from '../_internal/_equate-values';
import { hasOwn } from './has-own';

/**
 * Performs a shallow equality comparison of the contents of two map-likes.
 * @param left A map-like whose properties should be compared.
 * @param right A map-like whose properties should be compared.
 * @param equalityComparer A comparer function. Defaults to strict equality.
 * @returns `true` if the two map-likes are shallowly equal; else, `false`.
 */
export function equalOwnProperties<T>(
  left: Record<string, T> | undefined,
  right: Record<string, T> | undefined,
  equalityComparer: (a: T, b: T) => boolean = _equateValues
): boolean {
  if (left === right) return true;
  if (!left || !right) return false;
  for (const key in left) {
    if (hasOwn(left, key)) {
      if (!hasOwn(right, key)) return false;
      // hasOwn checks above guarantee left[key] and right[key] are present.
      // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
      if (!equalityComparer(left[key]!, right[key]!)) return false;
    }
  }

  for (const key in right) {
    if (hasOwn(right, key)) {
      if (!hasOwn(left, key)) return false;
    }
  }

  return true;
}
