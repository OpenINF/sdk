// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike, type Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is a
 * [`Temporal.PlainTime`](https://mdn.io/Global_Objects/Temporal/PlainTime),
 * a wall-clock time with no date and no time zone.
 *
 * The check is for the internal slots only `Temporal.PlainTime` gives an
 * object, so no other Temporal type passes, and neither does a look-alike
 * carrying `Symbol.toStringTag`. In a runtime without `Temporal`, nothing
 * does.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a `Temporal.PlainTime`; else, `false`.
 * @example
 * ```ts
 * isTemporalPlainTime(Temporal.PlainTime.from('12:30')); // ↪ true
 *
 * isTemporalPlainTime(new Date()); // ↪ false
 * ```
 */
export function isTemporalPlainTime(
  value: unknown
): value is Temporal.PlainTime {
  return isObjectLike(value) && _tagTester('Temporal.PlainTime')(value);
}
(isTemporalPlainTime as Guard).expectation = 'be a Temporal.PlainTime';
