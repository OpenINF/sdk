// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import type { Guard } from '@openinf/util-core';

import { _isObjectLike } from '../_internal/_is-object-like';
import { isObjectOfType } from '../types';

/**
 * Detects whether `value` is classified as a
 * [`Date`](https://mdn.io/Global_Objects/Date).
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a `Date`; else, `false`.
 * @example ```ts
 * import util from '@openinf/util';
 *
 * util.isDate(new Date()); // ↪ true
 *
 * util.isDate(new Date(91, 1)); // ↪ true
 *
 * util.isDate('Sun February 28 2021'); // ↪ false
 * ```
 */
export function isDate(value: unknown): value is globalThis.Date {
  return _isObjectLike(value) && isObjectOfType<Date>('Date')(value);
}
(isDate as Guard).expectation = 'be a Date object';
