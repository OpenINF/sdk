// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

const { isArray } = Array;

/**
 * Detects whether `value` is a
 * [`Proxy`](https://mdn.io/Global_Objects/Proxy) instance.
 *
 * Best effort: detects revoked proxies, including live proxies wrapping a
 * revoked proxy. The captured `Array.isArray` throws on their revoked target
 * without invoking proxy traps. Live proxies with ordinary targets remain
 * undetectable here, so `false` does not establish that a value is not a proxy.
 * @since 3.0.0
 * @category Reflection
 * @param value The value to identify.
 * @returns `true` if a revoked proxy is detected; otherwise, `false`.
 */
export function isProxy(value: unknown): boolean {
  try {
    isArray(value);
    return false;
  } catch {
    return true;
  }
}
