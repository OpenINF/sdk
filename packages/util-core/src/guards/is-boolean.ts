// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '../types';

/**
 * Detects whether `value` is classified as a
 * [`Boolean`](https://mdn.io/Global_Objects/Boolean) primitive or object.
 * @since 3.0.0
 * @category Fundamental Objects
 * @param value The value to identify.
 * @returns `true` if `value` is a `Function`; else, `false`.
 * @example ```ts
 * import util from '@openinf/util';
 *
 * util.isBoolean(1); // ↪ false
 *
 * util.isBoolean(false); // ↪ true
 *
 * util.isBoolean(null); // ↪ false
 * ```
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}
(isBoolean as Guard).expectation = 'be a Boolean primitive or object';
