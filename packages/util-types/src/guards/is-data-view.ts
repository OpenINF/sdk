// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`DataView`](https://mdn.io/Global_Objects/DataView).
 * @since 3.0.0
 * @category Structured Data
 * @param value The value to identify.
 * @returns `true` if `value` is a `DataView`; else, `false`.
 * @example
 * ```ts
 * isDataView(new DataView(new ArrayBuffer(16))); // ↪ true
 *
 * isDataView([]); // ↪ false
 * ```
 */
export function isDataView(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('DataView')(value);
}
