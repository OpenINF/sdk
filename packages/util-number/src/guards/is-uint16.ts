// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard, Tagged } from '@openinf/util-core';

import { isInteger } from './is-integer';

/**
 * A number in the range of a 16-bit unsigned integer, which is what ToUint16 produces.
 * @category Type Conversion
 */
export type Uint16 = Tagged<number, '__Uint16__'>;

/**
 * Detects whether `value` is a number ToUint16, section 7.1.11 of the
 * specification, would leave unchanged: an integer from 0 to 65535.
 *
 * `-0` does not pass because the conversion canonicalizes it to `+0`. ToUint16
 * itself accepts any number, converting one outside the range by wrapping it;
 * this asks whether the conversion would have anything to do.
 * @since 3.0.0
 * @category Type Conversion
 * @param value The value to identify.
 * @returns `true` if `value` is a 16-bit unsigned integer; else, `false`.
 * @example
 * ```ts
 * isUint16(65535); // ↪ true
 *
 * isUint16(65535 + 1); // ↪ false
 * ```
 */
export function isUint16(value: unknown): value is Uint16 {
  return (
    isInteger(value) && !Object.is(value, -0) && value >= 0 && value <= 65535
  );
}
(isUint16 as Guard).expectation = 'be a Uint16';
