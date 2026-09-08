// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`SharedArrayBuffer`](https://mdn.io/Global_Objects/SharedArrayBuffer).
 * @since 3.0.0
 * @category Structured Data
 * @param value The value to identify.
 * @returns `true` if `value` is a `SharedArrayBuffer`; else, `false`.
 * @example ```ts
 * isSharedArrayBuffer(new SharedArrayBuffer(16)); // ↪ true
 *
 * isSharedArrayBuffer(new ArrayBuffer(16)); // ↪ false
 *
 * isSharedArrayBuffer([]); // ↪ false
 * ```
 */
export function isSharedArrayBuffer(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('SharedArrayBuffer')(value);
}
