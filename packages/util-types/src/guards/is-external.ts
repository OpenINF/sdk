// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

/**
 * Detects whether `value` is a native `External` value.
 *
 * `External` values wrap native pointers but expose no standard JavaScript
 * brand check, so this always returns `false`. It exists only for API
 * compatibility with Node's `util.types.isExternal`,
 * which relies on an internal V8 binding with no pure-JS equivalent.
 * @since 3.0.0
 * @category Hosts and Implementations
 * @param _value The value to identify.
 * @returns `false`, always.
 */
export function isExternal(_value: unknown): boolean {
  return false;
}
