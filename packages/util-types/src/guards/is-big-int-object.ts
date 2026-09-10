// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`BigInt`](https://mdn.io/Global_Objects/BigInt) boxed primitive object.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a `BigInt` object; else, `false`.
 * @example
 * ```ts
 * isBigIntObject(); // ↪ false
 *
 * isBigIntObject(); // ↪ true
 * ```
 */
export function isBigIntObject(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('BigInt')(value);
}
