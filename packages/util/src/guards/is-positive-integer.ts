// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard, Tagged } from '@openinf/util-core';

import { isInteger } from './is-integer';

/**
 * An integer that is positive.
 */
export type PositiveInteger = Tagged<number, '__PositiveInteger__'>;

/**
 * Detects whether `value` is an integer greater than zero.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a positive integer; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isPositiveInteger(1); // ↪ true
 *
 * util.isPositiveInteger(1.5); // ↪ false
 *
 * util.isPositiveInteger(-1); // ↪ false
 * ```
 */
export function isPositiveInteger(value: unknown): value is PositiveInteger {
  return isInteger(value) && value > 0;
}
(isPositiveInteger as Guard).expectation = 'be a positive integer';
