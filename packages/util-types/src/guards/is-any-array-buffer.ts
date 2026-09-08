// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as one of either
 * [`ArrayBuffer`](https://mdn.io/Global_Objects/ArrayBuffer) or
 * [`SharedArrayBuffer`](https://mdn.io/Global_Objects/SharedArrayBuffer).
 * @since 3.0.0
 * @category Structured Data
 * @param value The value to identify.
 * @returns `true` if `value` is either array buffer; else, `false`.
 * @example ```ts
 * isAnyArrayBuffer(new ArrayBuffer(16)); // ↪ true
 *
 * isAnyArrayBuffer(new SharedArrayBuffer(16)); // ↪ true
 *
 * isAnyArrayBuffer([]); // ↪ false
 * ```
 */
export function isAnyArrayBuffer(value: unknown): boolean {
  return (
    isObjectLike(value) &&
    (_tagTester('ArrayBuffer')(value) || _tagTester('SharedArrayBuffer')(value))
  );
}
