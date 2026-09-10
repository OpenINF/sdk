// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard, Tagged } from '@openinf/util-core';

/**
 * A value that is a Uint32.
 */
export type Uint32 = Tagged<number, '__Uint32__'>;

/**
 * Detects whether `value` is classified as a `Uint32`.
 * @since 3.0.0
 * @category Numbers & Dates
 * @param value The value to be identified.
 * @returns `true` if `value` is a uint32; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isUint32(123); // ↪ true
 *
 * util.isUint32('123'); // ↪ false
 * ```
 */
export function isUint32(value: unknown): value is Uint32 {
  const asNumber = Number(value);
  return asNumber === asNumber >>> 0;
}
(isUint32 as Guard).expectation = 'be a `Uint32`';
