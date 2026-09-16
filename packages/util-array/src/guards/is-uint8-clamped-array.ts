// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as a
 * [`Uint8ClampedArray`](https://mdn.io/Global_Objects/Uint8ClampedArray).
 * @since 3.0.0
 * @category Indexed Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a `Uint8ClampedArray`; else, `false`.
 * @example
 * ```ts
 * isUint8ClampedArray(new Uint8ClampedArray()); // ↪ true
 *
 * isUint8ClampedArray([]); // ↪ false
 * ```
 */
export function isUint8ClampedArray(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Uint8ClampedArray')(value);
}
