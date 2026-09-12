// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// As of V8 6.6, depending on the size of the array, this is anywhere
// between 1.5-10x faster than the two-arg version of Array#splice()

/**
 * Removes a single element from `list` at `index`, in place.
 * @param list The array to remove the element from.
 * @param index The index of the element to remove.
 * @throws {RangeError} If `index` is not an integer within `list`.
 */
export function spliceOne<T>(list: T[], index: number): void {
  if (!Number.isInteger(index) || index < 0 || index >= list.length) {
    throw new RangeError('index must identify an element in list');
  }

  for (; index + 1 < list.length; index++) {
    if (index + 1 in list) {
      // index + 1 < list.length and the presence check guarantee this access.
      list[index] = list[index + 1]!;
    } else {
      Reflect.deleteProperty(list, index);
    }
  }
  list.pop();
}
