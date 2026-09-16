// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as an
 * [`Int8Array`](https://mdn.io/Global_Objects/Int8Array).
 * @since 3.0.0
 * @category Indexed Collections
 * @param value The value to identify.
 * @returns `true` if `value` is an `Int8Array`; else, `false`.
 * @example
 * ```ts
 * isInt8Array(new Int8Array()); // ↪ true
 *
 * isInt8Array([]); // ↪ false
 * ```
 */
export function isInt8Array(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Int8Array')(value);
}
