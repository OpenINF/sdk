// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from jQuery

import { isArrayLike } from '../guards/is-array-like';

/**
 * Translates the elements of an array-like or object into a new array,
 * flattening any nested arrays produced by `callback` one level deep.
 * @param elems The array-like or object to map over.
 * @param callback The function used to translate each element.
 * @param arg An extra argument passed through to `callback`; for internal
 * usage only.
 * @returns The mapped, one-level-flattened array.
 */
export function map<T, R>(
  elems: ArrayLike<T> | Record<string, T>,
  callback: (elem: T, key: number | string, arg: unknown) => R,
  arg?: unknown
): R[] {
  const ret: R[] = [];

  // Go through the array, translating each of the items to their new values
  if (isArrayLike<T>(elems)) {
    const length = elems.length;
    for (let i = 0; i < length; i++) {
      // i < length guarantees elems[i] is present.
      // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
      const value = callback(elems[i]!, i, arg);
      if (value != null) {
        ret.push(value);
      }
    }

    // Go through every key on the object,
  } else {
    for (const key in elems) {
      // key comes from `for...in` over elems, so it is guaranteed present.
      // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
      const value = callback(elems[key]!, key, arg);
      if (value != null) {
        ret.push(value);
      }
    }
  }

  // Flatten any nested arrays
  return (ret as unknown[]).flat() as R[];
}
