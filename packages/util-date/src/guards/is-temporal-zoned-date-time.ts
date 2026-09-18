// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike, type Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is a
 * [`Temporal.ZonedDateTime`](https://mdn.io/Global_Objects/Temporal/ZonedDateTime),
 * a date and time in a particular time zone.
 *
 * The check is for the internal slots only `Temporal.ZonedDateTime` gives an
 * object, so no other Temporal type passes, and neither does a look-alike
 * carrying `Symbol.toStringTag`. In a runtime without `Temporal`, nothing
 * does.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a `Temporal.ZonedDateTime`; else, `false`.
 * @example
 * ```ts
 * isTemporalZonedDateTime(Temporal.Now.zonedDateTimeISO()); // ↪ true
 *
 * isTemporalZonedDateTime(new Date()); // ↪ false
 * ```
 */
export function isTemporalZonedDateTime(
  value: unknown
): value is Temporal.ZonedDateTime {
  return isObjectLike(value) && _tagTester('Temporal.ZonedDateTime')(value);
}
(isTemporalZonedDateTime as Guard).expectation = 'be a Temporal.ZonedDateTime';
