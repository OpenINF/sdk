// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isNumber } from '@openinf/util-core';
import type { Guard, Tagged } from '@openinf/util-core';

/**
 * A number that is positive.
 */
export type Positive = Tagged<number, '__Positive__'>;

/**
 * Detects whether `value` is a
 * [`Number`](https://mdn.io/Global_Objects/Number) greater than zero.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is positive; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isPositive(1); // ↪ true
 *
 * util.isPositive(0); // ↪ false
 *
 * util.isPositive(-1); // ↪ false
 * ```
 */
export function isPositive(value: unknown): value is Positive {
  return isNumber(value) && value > 0;
}
(isPositive as Guard).expectation = 'be a positive number';
