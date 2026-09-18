// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike, type Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is a
 * [`Temporal.Instant`](https://mdn.io/Global_Objects/Temporal/Instant),
 * an exact point in time, counted in nanoseconds since the epoch.
 *
 * The check is for the internal slots only `Temporal.Instant` gives an
 * object, so no other Temporal type passes, and neither does a look-alike
 * carrying `Symbol.toStringTag`. In a runtime without `Temporal`, nothing
 * does.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a `Temporal.Instant`; else, `false`.
 * @example
 * ```ts
 * isTemporalInstant(Temporal.Now.instant()); // ↪ true
 *
 * isTemporalInstant(new Date()); // ↪ false
 * ```
 */
export function isTemporalInstant(value: unknown): value is Temporal.Instant {
  return isObjectLike(value) && _tagTester('Temporal.Instant')(value);
}
(isTemporalInstant as Guard).expectation = 'be a Temporal.Instant';
