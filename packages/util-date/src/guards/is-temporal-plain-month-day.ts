// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike, type Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is a
 * [`Temporal.PlainMonthDay`](https://mdn.io/Global_Objects/Temporal/PlainMonthDay),
 * a month and day with no year.
 *
 * The check is for the internal slots only `Temporal.PlainMonthDay` gives an
 * object, so no other Temporal type passes, and neither does a look-alike
 * carrying `Symbol.toStringTag`. In a runtime without `Temporal`, nothing
 * does.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a `Temporal.PlainMonthDay`; else, `false`.
 * @example
 * ```ts
 * isTemporalPlainMonthDay(Temporal.PlainMonthDay.from('09-16')); // ↪ true
 *
 * isTemporalPlainMonthDay(new Date()); // ↪ false
 * ```
 */
export function isTemporalPlainMonthDay(
  value: unknown
): value is Temporal.PlainMonthDay {
  return isObjectLike(value) && _tagTester('Temporal.PlainMonthDay')(value);
}
(isTemporalPlainMonthDay as Guard).expectation = 'be a Temporal.PlainMonthDay';
