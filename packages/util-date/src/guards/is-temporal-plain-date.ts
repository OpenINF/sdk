// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike, type Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is a
 * [`Temporal.PlainDate`](https://mdn.io/Global_Objects/Temporal/PlainDate),
 * a calendar date with no time and no time zone.
 *
 * The check is for the internal slots only `Temporal.PlainDate` gives an
 * object, so no other Temporal type passes, and neither does a look-alike
 * carrying `Symbol.toStringTag`. In a runtime without `Temporal`, nothing
 * does.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a `Temporal.PlainDate`; else, `false`.
 * @example
 * ```ts
 * isTemporalPlainDate(Temporal.PlainDate.from('2026-09-16')); // ↪ true
 *
 * isTemporalPlainDate(new Date()); // ↪ false
 * ```
 */
export function isTemporalPlainDate(
  value: unknown
): value is Temporal.PlainDate {
  return isObjectLike(value) && _tagTester('Temporal.PlainDate')(value);
}
(isTemporalPlainDate as Guard).expectation = 'be a Temporal.PlainDate';
