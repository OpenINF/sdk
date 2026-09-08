// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from jQuery

/**
 * Filters the elements of an array-like using a callback function.
 * @param elems The elements to filter.
 * @param callback The function to test each element with.
 * @param invert If `true`, keeps elements for which `callback` returns
 * falsy instead of truthy.
 * @returns The elements that passed the test.
 */
export function grep<T>(
  elems: ArrayLike<T>,
  callback: (elem: T, index: number) => boolean,
  invert = false
): T[] {
  const matches: T[] = [];
  const shouldMatchTruthy = !invert;
  const length = elems.length;

  // Go through the array, only saving the items
  // that pass the validator function
  for (let i = 0; i < length; i++) {
    // i < length guarantees elems[i] is present.
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
    const isCallbackFalsy = !callback(elems[i]!, i);
    if (isCallbackFalsy !== shouldMatchTruthy) {
      // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
      matches.push(elems[i]!);
    }
  }

  return matches;
}
