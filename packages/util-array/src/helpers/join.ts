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
  let str = '';
  if (output.length !== 0) {
    const lastIndex = output.length - 1;
    for (let i = 0; i < lastIndex; i++) {
      str += String(output[i]);
      str += separator;
    }
    str += String(output[lastIndex]);
  }
  return str;
}
