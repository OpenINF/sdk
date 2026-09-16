// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard, Tagged } from '@openinf/util-core';

import { isInteger } from './is-integer';

/**
 * A number in the range of an 8-bit two’s complement signed integer, which is what ToInt8 produces.
 * @category Type Conversion
 */
export type Int8 = Tagged<number, '__Int8__'>;

/**
 * Detects whether `value` is a number ToInt8, section 7.1.12 of the
 * specification, would leave unchanged: an integer from -128 to 127.
 *
 * `-0` passes, being an integer in range. ToInt8 itself accepts any number,
 * converting one outside the range by wrapping it; this asks whether the
 * conversion would have anything to do.
 * @since 3.0.0
 * @category Type Conversion
 * @param value The value to identify.
 * @returns `true` if `value` is an 8-bit two’s complement signed integer; else, `false`.
 * @example
 * ```ts
 * isInt8(127); // ↪ true
 *
 * isInt8(127 + 1); // ↪ false
 * ```
 */
export function isInt8(value: unknown): value is Int8 {
  return isInteger(value) && value >= -128 && value <= 127;
}
(isInt8 as Guard).expectation = 'be an Int8';
