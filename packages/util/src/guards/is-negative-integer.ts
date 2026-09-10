// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard, Tagged } from '@openinf/util-core';

import { isInteger } from './is-integer';

/**
 * An integer that is negative.
 */
export type NegativeInteger = Tagged<number, '__NegativeInteger__'>;

/**
 * Detects whether `value` is an integer less than zero.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a negative integer; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isNegativeInteger(-1); // ↪ true
 *
 * util.isNegativeInteger(-1.5); // ↪ false
 *
 * util.isNegativeInteger(1); // ↪ false
 * ```
 */
export function isNegativeInteger(value: unknown): value is NegativeInteger {
  return isInteger(value) && value < 0;
}
(isNegativeInteger as Guard).expectation = 'be a negative integer';
