// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`Number`](https://mdn.io/Global_Objects/Number) boxed primitive object.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a `Number` object; else, `false`.
 * @example ```ts
 * isNumberObject(3); // ↪ false
 *
 * isNumberObject(Number('123')); // ↪ true
 * ```
 */
export function isNumberObject(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Number')(value);
}
