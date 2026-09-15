// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as a
 * [`Uint16Array`](https://mdn.io/Global_Objects/Uint16Array).
 * @since 3.0.0
 * @category Indexed Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a `Uint16Array`; else, `false`.
 * @example
 * ```ts
 * isUint16Array(new Uint16Array()); // ↪ true
 *
 * isUint16Array([]]); // ↪ false
 * ```
 */
export function isUint16Array(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Uint16Array')(value);
}
