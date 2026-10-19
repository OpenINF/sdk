// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Detects whether `value` is already an object, so that `Object(value)`
 * returns `value` itself rather than wrapping it. Functions pass; primitives,
 * `null` and `undefined` do not.
 * @category Testing and Comparison Operations
 * @param value The value to check.
 * @returns `true` if `value` is an object; else, `false`.
 */
export function isObjectCoercible(value: unknown): boolean {
  return value === Object(value);
}
