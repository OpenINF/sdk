// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as an
 * [`Int16Array`](https://mdn.io/Global_Objects/Int16Array).
 * @since 3.0.0
 * @category Indexed Collections
 * @param value The value to identify.
 * @returns `true` if `value` is an `Int16Array`; else, `false`.
 * @example
 * ```ts
 * isInt16Array(new Int16Array()); // ↪ true
 *
 * isInt16Array([]); // ↪ false
 * ```
 */
export function isInt16Array(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Int16Array')(value);
}
