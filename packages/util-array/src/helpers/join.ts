// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Joins the elements of an array-like into a string, separated by
 * `separator`.
 * @category Indexed Collections
 * @param output The elements to join.
 * @param separator The separator to insert between elements.
 * @returns The joined string.
 */
export function join(output: ArrayLike<unknown>, separator: string): string {
  // Normalized as ToLength does for Array.prototype.join, so a fractional,
  // negative, or NaN length cannot read past the elements or before them.
  const length = Math.max(0, Math.trunc(output.length) || 0);
  let str = '';
  if (length !== 0) {
    const lastIndex = length - 1;
    for (let i = 0; i < lastIndex; i++) {
      str += String(output[i]);
      str += separator;
    }
    str += String(output[lastIndex]);
  }
  return str;
}
