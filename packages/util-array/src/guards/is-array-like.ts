// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from jQuery

import { isArray, isFunction, isNullish } from '@openinf/util-core';

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 * @since 3.0.0
 * @category Index Collections
 * @param value The value to identify.
 * @returns `true` if `value` is array-like; else, `false`.
 * @example ```ts
 * isArrayLike([1, 2, 3]); // ↪ true
 *
 * isArrayLike(document.body.children); // ↪ true
 *
 * isArrayLike('abc'); // ↪ true
 *
 * isArrayLike(Function); // ↪ false
 * ```
 */
export function isArrayLike<T = unknown>(
  value: unknown
): value is ArrayLike<T> {
  if (isNullish(value) || isFunction(value)) {
    return false;
  }

  if (isArray(value)) {
    return true;
  }

  const length = (value as { length?: unknown }).length;

  return (
    typeof length === 'number' &&
    Number.isInteger(length) &&
    length >= 0 &&
    length <= Number.MAX_SAFE_INTEGER
  );
}
