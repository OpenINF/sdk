// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard, Tagged } from '@openinf/util-core';

/**
 * The number `-0`, which the specification writes as `-0𝔽`.
 * @category Numbers and Dates
 */
export type NegativeZero = Tagged<number, '__NegativeZero__'>;

/**
 * Detects whether `value` is `-0`, the negative zero the specification keeps
 * apart from `+0` throughout.
 *
 * `===` cannot tell them apart, since `-0 === 0`, and neither can a comparison
 * against `0`. `Object.is`, which performs SameValue, can, and that is what
 * this asks.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is `-0`; else, `false`.
 * @example
 * ```ts
 * isNegativeZero(-0); // ↪ true
 *
 * isNegativeZero(0); // ↪ false
 * ```
 */
export function isNegativeZero(value: unknown): value is NegativeZero {
  return Object.is(value, -0);
}
(isNegativeZero as Guard).expectation = 'be negative zero';
