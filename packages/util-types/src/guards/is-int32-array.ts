// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as an
 * [`Int32Array`](https://mdn.io/Global_Objects/Int32Array).
 * @since 3.0.0
 * @category Index Collections
 * @param value The value to identify.
 * @returns `true` if `value` is an `Int32Array`; else, `false`.
 * @example
 * ```ts
 * isInt32Array(new Int32Array()); // ↪ true
 *
 * isInt32Array([]]); // ↪ false
 * ```
 */
export function isInt32Array(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Int32Array')(value);
}
