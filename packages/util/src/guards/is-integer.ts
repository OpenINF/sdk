// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isNumber } from '@openinf/util-core';
import type { Guard, Tagged } from '@openinf/util-core';

/**
 * A number that is an integer.
 */
export type Integer = Tagged<number, '__Integer__'>;

/**
 * Detects whether `value` is an integer: a number primitive with no
 * fractional part. A `Number` object is refused.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is an integer; else, `false`.
 * @example
 * ```ts
 * import { isInteger } from '@openinf/util';
 *
 * isInteger(3); // ↪ true
 *
 * isInteger(3.5); // ↪ false
 *
 * isInteger('3'); // ↪ false
 * ```
 */
export function isInteger(value: unknown): value is Integer {
  return isNumber(value) && Number.isInteger(value);
}
(isInteger as Guard).expectation = 'be an integer';
