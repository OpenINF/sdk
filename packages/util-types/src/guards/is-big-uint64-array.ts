// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`BigUint64Array`](https://mdn.io/Global_Objects/BigUInt64Array).
 * @since 3.0.0
 * @category Index Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a `BigUint64Array`; else, `false`.
 * @example ```ts
 * isBigUint64Array(new BigUint64Array()); // ↪ true
 *
 * isBigUint64Array([]]); // ↪ false
 * ```
 */
export function isBigUint64Array(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('BigUint64Array')(value);
}
