// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`Boolean`](https://mdn.io/Global_Objects/Boolean) boxed primitive object.
 * @since 3.0.0
 * @category Fundamental Objects
 * @param value The value to be identified.
 * @returns `true` if `value` is a `Boolean` object; else, `false`.
 * @example
 * ```ts
 * isBooleanObject(new Boolean(false)); // ↪ true
 *
 * isBooleanObject(true); // ↪ false
 *
 * isBooleanObject(Boolean(true)); // ↪ false
 * ```
 */
export function isBooleanObject(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Boolean')(value);
}
