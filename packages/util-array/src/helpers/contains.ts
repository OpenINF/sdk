// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { EqualityComparer } from '../types';

function equateValues<T>(a: T, b: T): boolean {
  return a === b;
}

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
