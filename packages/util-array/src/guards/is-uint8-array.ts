// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as a
 * [`Uint8Array`](https://mdn.io/Global_Objects/Uint8Array).
 * @since 3.0.0
 * @category Indexed Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a `Uint8Array`; else, `false`.
 * @example
 * ```ts
 * isUint8Array(new Uint8Array()); // ↪ true
 *
 * isUint8Array([]); // ↪ false
 * ```
 */
export function isUint8Array(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Uint8Array')(value);
}
