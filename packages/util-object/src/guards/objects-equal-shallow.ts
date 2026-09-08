// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Performs a shallow equality comparison of the contents of two map-likes.
 * @param obj1 A map-like whose properties should be compared.
 * @param obj2 A map-like whose properties should be compared.
 * @returns `true` if the two map-likes are shallowly equal; else, `false`.
 */
export function objectsEqualShallow<T>(
  obj1: Record<string, T> | null | undefined,
  obj2: Record<string, T> | null | undefined
): boolean {
  if (obj1 == null || obj2 == null) {
    // `null` is only equal to `null`, and `undefined` to `undefined`.
    return obj1 === obj2;
  }
  for (const key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  for (const key in obj2) {
    if (obj2[key] !== obj1[key]) {
      return false;
    }
  }
  return true;
}
