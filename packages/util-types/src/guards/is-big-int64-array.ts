// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`BigInt64Array`](https://mdn.io/Global_Objects/BigInt64Array).
 * @since 3.0.0
 * @category Index Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a `BigInt64Array`; else, `false`.
 * @example ```ts
 * isBigInt64Array(new BigInt64Array()); // ↪ true
 *
 * isBigInt64Array([]]); // ↪ false
 * ```
 */
export function isBigInt64Array(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('BigInt64Array')(value);
}
