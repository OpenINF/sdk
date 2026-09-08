// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

/**
 * Detects whether `value` is a native `External` value.
 *
 * `External` values wrap C++ pointers and are never exposed to JavaScript in
 * a way pure-JS code could observe or construct, so this always returns
 * `false`. It exists only for parity with Node's `util.types.isExternal`,
 * which relies on an internal V8 binding with no pure-JS equivalent.
 * @since 3.0.0
 * @category Other
 * @param _value The value to identify.
 * @returns `false`, always.
 */
export function isExternal(_value: unknown): boolean {
  return false;
}
