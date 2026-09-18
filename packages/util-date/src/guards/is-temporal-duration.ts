// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike, type Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is a
 * [`Temporal.Duration`](https://mdn.io/Global_Objects/Temporal/Duration),
 * a length of time.
 *
 * The check is for the internal slots only `Temporal.Duration` gives an
 * object, so no other Temporal type passes, and neither does a look-alike
 * carrying `Symbol.toStringTag`. In a runtime without `Temporal`, nothing
 * does.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a `Temporal.Duration`; else, `false`.
 * @example
 * ```ts
 * isTemporalDuration(Temporal.Duration.from({ days: 1 })); // ↪ true
 *
 * isTemporalDuration(new Date()); // ↪ false
 * ```
 */
export function isTemporalDuration(value: unknown): value is Temporal.Duration {
  return isObjectLike(value) && _tagTester('Temporal.Duration')(value);
}
(isTemporalDuration as Guard).expectation = 'be a Temporal.Duration';
