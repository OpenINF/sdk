// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Detects whether `key` is a direct or inherited property of `obj`.
 * @since 3.0.0
 * @category Fundamental Objects
 * @param obj The object to query.
 * @param key A property name.
 * @returns `true` if `key` exists in `obj`; else, `false`.
 * @see hasOwn
 * @example
 * ```ts
 * const obj = { 'a': { 'b': 2 } }
 * const other = create(obj)
 *
 * has(obj, 'a') // ↪ true
 *
 * has(other, 'a') // ↪ true, inherited from `obj`
 *
 * has(other, 'b') // ↪ false
 * ```
 */
export function has<P extends PropertyKey>(
  obj: Record<P, unknown>,
  key: P
): obj is { [K in P]: unknown } {
  // The `in` operator throws a `TypeError` for non-object values.
  return key in obj;
}
