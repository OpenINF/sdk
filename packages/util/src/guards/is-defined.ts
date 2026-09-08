// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is _defined_, which passes for all value types
 * other than `undefined` and `null`.
 * @since 3.0.0
 * @category Value Properties
 * @param value The value to identify.
 * @returns `true` if `value` is not `undefined` or `null`; else, `false`.
 * @example ```ts
 * import util from '@openinf/util';
 *
 * util.isDefined(void 0); // ↪ false
 *
 * util.isDefined(undefined); // ↪ false
 *
 * util.isDefined(null); // ↪ false
 * ```
 */
export function isDefined<T>(value: T | undefined | null | void): value is T {
  return value !== undefined && value !== null;
}
(isDefined as Guard).expectation = 'not be of type `undefined` or `null`';
