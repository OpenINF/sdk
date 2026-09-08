// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

/**
 * Detects whether `value` is a
 * [`Proxy`](https://mdn.io/Global_Objects/Proxy) instance.
 *
 * A `Proxy` is transparent by design -- pure JavaScript code cannot
 * distinguish a proxied object from its target, so this always returns
 * `false`. It exists only for parity with Node's `util.types.isProxy`,
 * which relies on an internal V8 binding with no pure-JS equivalent.
 * @since 3.0.0
 * @category Reflection
 * @param _value The value to identify.
 * @returns `false`, always.
 */
export function isProxy(_value: unknown): boolean {
  return false;
}
