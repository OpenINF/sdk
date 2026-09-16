// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard, Tagged } from '@openinf/util-core';

import { isInteger } from './is-integer';

/**
 * A number in the range of an 8-bit unsigned integer, which is what ToUint8 produces.
 * @category Type Conversion
 */
export type Uint8 = Tagged<number, '__Uint8__'>;

/**
 * Detects whether `value` is a number ToUint8, section 7.1.13 of the
 * specification, would leave unchanged: an integer from 0 to 255.
 *
 * `-0` passes, being an integer in range. ToUint8 itself accepts any number,
 * converting one outside the range by wrapping it; this asks whether the
 * conversion would have anything to do.
 * @since 3.0.0
 * @category Type Conversion
 * @param value The value to identify.
 * @returns `true` if `value` is an 8-bit unsigned integer; else, `false`.
 * @example
 * ```ts
 * isUint8(255); // ↪ true
 *
 * isUint8(255 + 1); // ↪ false
 * ```
 */
export function isUint8(value: unknown): value is Uint8 {
  return isInteger(value) && value >= 0 && value <= 255;
}
(isUint8 as Guard).expectation = 'be a Uint8';
