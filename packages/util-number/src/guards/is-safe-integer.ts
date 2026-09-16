// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard, Tagged } from '@openinf/util-core';

/**
 * An integer that JavaScript can tell from every other integer.
 * @category Numbers and Dates
 */
export type SafeInteger = Tagged<number, '__SafeInteger__'>;

/**
 * Detects whether `value` is a safe integer, as `Number.isSafeInteger` does:
 * an integer between -(2^53 - 1) and 2^53 - 1.
 *
 * Beyond that range a double cannot hold every integer, so one value stands
 * for several: `2 ** 53` and `2 ** 53 + 1` are the same number. `isInteger`
 * accepts those; this does not.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a safe integer; else, `false`.
 * @example
 * ```ts
 * isSafeInteger(2 ** 53 - 1); // ↪ true
 *
 * isSafeInteger(2 ** 53); // ↪ false
 * ```
 */
export function isSafeInteger(value: unknown): value is SafeInteger {
  return Number.isSafeInteger(value);
}
(isSafeInteger as Guard).expectation = 'be a safe integer';
