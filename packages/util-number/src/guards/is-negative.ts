// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield

import { isNumber } from '@openinf/util-core';
import type { Guard, Tagged } from '@openinf/util-core';

/**
 * A number that is negative.
 * @category Numbers and Dates
 */
export type Negative = Tagged<number, '__Negative__'>;

/**
 * Detects whether `value` is a
 * [`Number`](https://mdn.io/Global_Objects/Number) less than zero.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is negative; else, `false`.
 * @example
 * ```ts
 * import { isNegative } from '@openinf/util-number';
 *
 * isNegative(-1); // ↪ true
 *
 * isNegative(0); // ↪ false
 *
 * isNegative(1); // ↪ false
 * ```
 */
export function isNegative(value: unknown): value is Negative {
  return isNumber(value) && value < 0;
}
(isNegative as Guard).expectation = 'be a negative number';
