// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Gets the values at the own, present indices of a (possibly sparse) array.
 * @param sparseArray The array to query.
 * @returns The values at the array's own indices.
 */
export function getOwnValues<T>(sparseArray: readonly T[]): T[] {
  const values: T[] = [];
  for (let i = 0; i < sparseArray.length; i++) {
    if (Object.prototype.hasOwnProperty.call(sparseArray, i)) {
      // hasOwnProperty confirms index i is a present (non-hole) element.
      // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
      values.push(sparseArray[i]!);
    }
  }

  return values;
}
