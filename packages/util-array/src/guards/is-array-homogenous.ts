// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { EqualityComparer } from '../types';

export function equateValues<T>(a: T, b: T): boolean {
  return a === b;
}

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
