// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`Float64Array`](https://mdn.io/Global_Objects/Float64Array).
 * @since 3.0.0
 * @category Index Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a `Float64Array`; else, `false`.
 * @example
 * ```ts
 * isFloat64Array(new Float64Array()); // ↪ true
 *
 * isFloat64Array([]]); // ↪ false
 * ```
 */
export function isFloat64Array(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Float64Array')(value);
}
