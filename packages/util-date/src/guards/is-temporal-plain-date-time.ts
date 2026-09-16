// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike, type Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is a
 * [`Temporal.PlainDateTime`](https://mdn.io/Global_Objects/Temporal/PlainDateTime),
 * a date and time with no time zone.
 *
 * The check is for the internal slots only `Temporal.PlainDateTime` gives an
 * object, so no other Temporal type passes, and neither does a look-alike
 * carrying `Symbol.toStringTag`. In a runtime without `Temporal`, nothing
 * does.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a `Temporal.PlainDateTime`; else, `false`.
 * @example
 * ```ts
 * isTemporalPlainDateTime(Temporal.PlainDateTime.from('2026-09-16T12:30')); // ↪ true
 *
 * isTemporalPlainDateTime(new Date()); // ↪ false
 * ```
 */
export function isTemporalPlainDateTime(
  value: unknown
): value is Temporal.PlainDateTime {
  return isObjectLike(value) && _tagTester('Temporal.PlainDateTime')(value);
}
(isTemporalPlainDateTime as Guard).expectation = 'be a Temporal.PlainDateTime';
