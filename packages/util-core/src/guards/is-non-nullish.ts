// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '../types';

/**
 * Detects whether `value` neither evaluates to
 * [`null`](https://mdn.io/Global_Objects/null) nor
 * [`undefined`](https://mdn.io/Global_Objects/undefined).
 * @since 3.0.0
 * @category Value Properties
 * @param value The value to identify.
 * @returns `true` if `value` is non-nullish; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isNonNullish(null); // ↪ false
 *
 * util.isNonNullish(void 0); // ↪ false
 *
 * util.isNonNullish(NaN); // ↪ true
 * ```
 */
export function isNonNullish<T = unknown>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
(isNonNullish as Guard).expectation = 'be a non-nullish value';
