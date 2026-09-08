// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`Uint32Array`](https://mdn.io/Global_Objects/Uint32Array).
 * @since 3.0.0
 * @category Index Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a `Uint32Array`; else, `false`.
 * @example ```ts
 * isUint32Array(new Uint32Array()); // ↪ true
 *
 * isUint32Array([]]); // ↪ false
 * ```
 */
export function isUint32Array(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Uint32Array')(value);
}
