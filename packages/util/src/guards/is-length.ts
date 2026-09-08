// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isInteger } from './is-integer';

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/11.0/#sec-tolength).
 * @since 3.0.0
 * @category Index Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a valid length; else, `false`.
 * @example ```ts
 * isLength(3); // ↪ true
 *
 * isLength(Number.MIN_VALUE); // ↪ false
 *
 * isLength(Infinity); // ↪ false
 *
 * isLength('3'); // ↪ false
 * ```
 */
export function isLength(value: unknown): boolean {
  return isInteger(value) && value > -1 && value <= Number.MAX_SAFE_INTEGER;
}
