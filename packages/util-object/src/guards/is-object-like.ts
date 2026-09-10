// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard, Tagged } from '@openinf/util-core';

/**
 * A value that is object-like.
 */
export type ObjectLike = Tagged<Record<string, unknown>, '__ObjectLike__'>;

/**
 * Detects whether `value` is an object. A value is object-like if it has
 * a `typeof` result of "object" and is not `null`. Because `null` unexpectedly
 * has a `typeof` result of "object", its exclusion is special-cased to avoid
 * false-positives.
 * @since 3.0.0
 * @category Fundamental Object
 * @param value The value to identify.
 * @returns `true` if `value` is an object; else, `false`.
 * @example
 * ```ts
 * isObjectLike({}); // ↪ true
 *
 * isObjectLike([1, 2, 3]); // ↪ true
 *
 * isObjectLike(noop); // ↪ true
 *
 * isObjectLike(null); // ↪ false
 * ```
 */
export function isObjectLike(value: unknown): value is ObjectLike {
  return (
    value !== null && (typeof value === 'object' || typeof value === 'function')
  );
}
(isObjectLike as Guard).expectation = 'be object-like';
