// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Creates an array of `count` elements, each the result of calling `f` with
 * its index.
 * @category Indexed Collections
 * @param count The length of the array. A fractional count is truncated, and
 * a negative or `NaN` count gives an empty array, as with `Array.from`.
 * @param f Called with each index to produce the element there.
 * @returns The new array.
 */
export function arrayOf<T>(count: number, f: (index: number) => T): T[] {
  const result: T[] = Array.from<T>({ length: count });
  for (let i = 0; i < count; i++) {
    result[i] = f(i);
  }
  return result;
}
