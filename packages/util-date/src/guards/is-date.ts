// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike, type Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as a
 * [`Date`](https://mdn.io/Global_Objects/Date).
 *
 * This is a type check, not a validity check: an Invalid Date (one whose
 * time value is `NaN`) is still a `Date`, so it satisfies this guard. That
 * matches `node:util`'s `types.isDate`, as well as `lodash.isDate` and
 * `@sindresorhus/is`'s `is.date`. Use `isValidDate` to additionally require a
 * usable time value.
 *
 * The check is for the time value only the `Date` constructor gives an object,
 * so a look-alike that sets `Symbol.toStringTag` to `'Date'`, or inherits from
 * `Date.prototype`, is refused.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a `Date`; else, `false`.
 * @example
 * ```ts
 * isDate(new Date(91, 1)); // ↪ true
 *
 * isDate(new Date(NaN)); // ↪ true (an Invalid Date is still a Date)
 *
 * isDate('Sun February 28 2021'); // ↪ false
 * ```
 */
export function isDate(value: unknown): value is Date {
  return isObjectLike(value) && _tagTester('Date')(value);
}
(isDate as Guard).expectation = 'be a Date object';
