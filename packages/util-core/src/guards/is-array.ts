// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { Guard } from '../types';

/**
 * Alias for [`Array.isArray()`](https://mdn.io/Array/isArray).
 * Detects whether `value` is classified as an
 * [`Array`](https://mdn.io/Global_Objects/Array).
 * The elements remain unknown; this checks the container, not its contents.
 * @since 3.0.0
 * @category Indexed Collections
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
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
(isArray as Guard).expectation = 'be an Array';
