// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Performs a shallow equality comparison of the contents of two map-likes.
 * @category Fundamental Objects
 * @param obj1 A map-like whose properties should be compared.
 * @param obj2 A map-like whose properties should be compared.
 * @returns `true` if the two map-likes have the same enumerable keys, own or
 * inherited, holding strictly equal values; else, `false`.
 */
export function objectsEqualShallow<T>(
  obj1: Record<string, T> | null | undefined,
  obj2: Record<string, T> | null | undefined
): boolean {
  if (obj1 == null || obj2 == null) {
    // `null` is only equal to `null`, and `undefined` to `undefined`.
    return obj1 === obj2;
  }
  // Compared by key as well as by value: reading a key one side lacks gives
  // `undefined`, the same as a key that holds it.
  const keys1 = new Set<string>();
  for (const key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
    keys1.add(key);
  }
  let count2 = 0;
  for (const key in obj2) {
    if (!keys1.has(key)) {
      return false;
    }
    count2 += 1;
  }
  return count2 === keys1.size;
}
