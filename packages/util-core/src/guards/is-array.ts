// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { Guard } from '../types';

/**
 * Alias for [`Array.isArray()`](https://mdn.io/Array/isArray).
 * Detects whether `value` is classified as an
 * [`Array`](https://mdn.io/Global_Objects/Array).
 * @since 3.0.0
 * @category Index Collections
 * @param value The value to identify.
 * @returns `true` if `value` is an `Array`; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isArray([]); // ↪ true
 *
 * util.isArray(new Array()); // ↪ true
 *
 * util.isArray({}); // ↪ false
 * ```
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}
(isArray as Guard).expectation = 'be an Array';
