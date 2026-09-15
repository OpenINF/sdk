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
  // The allocated length, not `count`: `Array.from` truncates a fractional
  // count, and looping to the original would write one element past it.
  for (let i = 0; i < result.length; i++) {
    result[i] = f(i);
  }
  return result;
}
