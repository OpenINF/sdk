// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

import { isDate } from './is-date';

// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const getTime = Date.prototype.getTime;
const { apply } = Reflect;

/**
 * Detects whether `value` is a [`Date`](https://mdn.io/Global_Objects/Date)
 * representing a usable point in time.
 *
 * `isDate` is a type check and accepts an Invalid Date, since one is still a
 * `Date` object. This additionally requires the time value not be `NaN`,
 * which is the distinction `@sindresorhus/is` draws between `is.date` and
 * `is.validDate`.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a valid `Date`; else, `false`.
 * @example
 * ```ts
 * import { isValidDate } from '@openinf/util';
 *
 * isValidDate(new Date(91, 1)); // ↪ true
 *
 * isValidDate(new Date(NaN)); // ↪ false
 *
 * isValidDate(new Date('nope')); // ↪ false
 *
 * isValidDate('Sun February 28 2021'); // ↪ false
 * ```
 */
export function isValidDate(value: unknown): value is Date {
  // The time value is read through the intrinsic, captured at load, rather
  // than through `value.getTime`, which a Date can shadow with its own.
  return isDate(value) && !Number.isNaN(apply(getTime, value, []));
}

(isValidDate as Guard).expectation = 'be a valid Date object';
