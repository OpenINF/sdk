// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as an
 * [`ArrayBuffer`](https://mdn.io/Global_Objects/ArrayBuffer).
 * @since 3.0.0
 * @category Structured Data
 * @param value The value to identify.
 * @returns `true` if `value` is an `ArrayBuffer`; else, `false`.
 * @example ```ts
 * isArrayBuffer(new ArrayBuffer(16)); // ↪ true
 *
 * isArrayBuffer(new SharedArrayBuffer(16)); // ↪ false
 *
 * isArrayBuffer([]); // ↪ false
 * ```
 */
export function isArrayBuffer(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('ArrayBuffer')(value);
}
