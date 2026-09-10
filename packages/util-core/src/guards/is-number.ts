// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeScript

import type { Guard } from '../types';

/**
 * Detects whether `value` is classified as a
 * [`Number`](https://mdn.io/Global_Objects/Number) primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * also classified as numbers, use `isNumeric` instead.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a number; else, `false`.
 * @see isNumberObject, isNumeric, isInteger, toInteger, toNumber
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isNumber('0'); // ↪ false
 *
 * util.isNumber(0); // ↪ true
 *
 * util.isNumber(Number.MIN_VALUE); // ↪ true
 *
 * util.isNumber(NaN); // ↪ true
 *
 * util.isNumber(Infinity); // ↪ true
 * ```
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}
(isNumber as Guard).expectation = 'be a number';
