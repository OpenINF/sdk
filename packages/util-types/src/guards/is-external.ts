// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { types as nodeTypes } from 'node:util';

/**
 * Detects whether `value` is a native `External` value.
 *
 * @since 3.0.0
 * @category Other
 * @param value The value to identify.
 * @returns `true` if `value` is an external native value; else, `false`.
 */
export function isExternal(value: unknown): boolean {
  return nodeTypes.isExternal(value);
}
