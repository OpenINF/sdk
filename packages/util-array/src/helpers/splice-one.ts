// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Removes a single element from `list` at `index`, in place.
 * @category Indexed Collections
 * @param list The array to remove the element from.
 * @param index The index of the element to remove.
 * @throws {RangeError} If `index` is not an integer within `list`.
 */
export function spliceOne<T>(list: T[], index: number): void {
  if (!Number.isInteger(index) || index < 0 || index >= list.length) {
    throw new RangeError('index must identify an element in list');
  }

  for (; index + 1 < list.length; index++) {
    // `Object.hasOwn` rather than `in`, which answers for the prototype as
    // well. A numeric property on `Array.prototype` would otherwise be copied
    // into the array in place of the hole it is standing in for, and this
    // package does not trust that object.
    if (Object.hasOwn(list, index + 1)) {
      // index + 1 < list.length and the presence check guarantee this access.
      list[index] = list[index + 1]!;
    } else {
      Reflect.deleteProperty(list, index);
    }
  }
  list.pop();
}
