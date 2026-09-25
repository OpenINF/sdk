// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as a
 * [`Float16Array`](https://mdn.io/Global_Objects/Float16Array), the typed
 * array ES2025 added.
 * @since 3.0.0
 * @category Indexed Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a `Float16Array`; else, `false`.
 * @example
 * ```ts
 * isFloat16Array(new Float16Array()); // ↪ true
 *
 * isFloat16Array([]); // ↪ false
 * ```
 */
export function isFloat16Array(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Float16Array')(value);
}
