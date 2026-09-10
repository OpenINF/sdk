// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// NOT adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

/**
 * Detects whether `value` is map-like, i.e. a non-array object whose
 * properties can be indexed by string.
 * @param value The value to identify.
 * @returns `true` if `value` is map-like; else, `false`.
 * @example
 * ```ts
 * isMapLike({ a: 1 }); // ↪ true
 *
 * isMapLike([1, 2, 3]); // ↪ false
 * ```
 */
export function isMapLike<T = unknown>(
  value: unknown
): value is Record<string, T> {
  return isObjectLike(value) && !Array.isArray(value);
}
