// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard, Tagged } from '@openinf/util-core';

import { isInteger } from './is-integer';

/**
 * A number in the range of a 16-bit two’s complement signed integer, which is what ToInt16 produces.
 * @category Type Conversion
 */
export type Int16 = Tagged<number, '__Int16__'>;

/**
 * Detects whether `value` is a number ToInt16, section 7.1.10 of the
 * specification, would leave unchanged: an integer from -32768 to 32767.
 *
 * `-0` passes, being an integer in range. ToInt16 itself accepts any number,
 * converting one outside the range by wrapping it; this asks whether the
 * conversion would have anything to do.
 * @since 3.0.0
 * @category Type Conversion
 * @param value The value to identify.
 * @returns `true` if `value` is a 16-bit two’s complement signed integer; else, `false`.
 * @example
 * ```ts
 * isInt16(32767); // ↪ true
 *
 * isInt16(32767 + 1); // ↪ false
 * ```
 */
export function isInt16(value: unknown): value is Int16 {
  return isInteger(value) && value >= -32768 && value <= 32767;
}
(isInt16 as Guard).expectation = 'be an Int16';
