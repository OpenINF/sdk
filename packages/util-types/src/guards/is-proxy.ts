// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { types as nodeTypes } from 'node:util';

/**
 * Detects whether `value` is a
 * [`Proxy`](https://mdn.io/Global_Objects/Proxy) instance.
 *
 * @since 3.0.0
 * @category Reflection
 * @param value The value to identify.
 * @returns `true` if `value` is a proxy; else, `false`.
 */
export function isProxy(value: unknown): boolean {
  return nodeTypes.isProxy(value);
}
