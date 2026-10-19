// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as a
 * [`BigInt`](https://mdn.io/Global_Objects/BigInt) boxed primitive object.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a `BigInt` object; else, `false`.
 * @example
 * ```ts
 * import { isBigIntObject } from '@openinf/util-number';
 *
 * isBigIntObject(1n); // ↪ false
 *
 * isBigIntObject(Object(1n)); // ↪ true
 * ```
 */
export function isBigIntObject(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('BigInt')(value);
}
