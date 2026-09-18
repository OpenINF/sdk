// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike, type Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is a
 * [`Temporal.PlainYearMonth`](https://mdn.io/Global_Objects/Temporal/PlainYearMonth),
 * a year and month with no day.
 *
 * The check is for the internal slots only `Temporal.PlainYearMonth` gives an
 * object, so no other Temporal type passes, and neither does a look-alike
 * carrying `Symbol.toStringTag`. In a runtime without `Temporal`, nothing
 * does.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a `Temporal.PlainYearMonth`; else, `false`.
 * @example
 * ```ts
 * isTemporalPlainYearMonth(Temporal.PlainYearMonth.from('2026-09')); // ↪ true
 *
 * isTemporalPlainYearMonth(new Date()); // ↪ false
 * ```
 */
export function isTemporalPlainYearMonth(
  value: unknown
): value is Temporal.PlainYearMonth {
  return isObjectLike(value) && _tagTester('Temporal.PlainYearMonth')(value);
}
(isTemporalPlainYearMonth as Guard).expectation =
  'be a Temporal.PlainYearMonth';
