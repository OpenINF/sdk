// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// As of V8 6.6, depending on the size of the array, this is anywhere
// between 1.5-10x faster than the two-arg version of Array#splice()

/**
 * Removes a single element from `list` at `index`, in place.
 * @param list The array to remove the element from.
 * @param index The index of the element to remove.
 */
export function spliceOne<T>(list: T[], index: number): void {
  // index + 1 < list.length guarantees list[index + 1] is present.
  for (; index + 1 < list.length; index++) list[index] = list[index + 1]!;
  list.pop();
}
