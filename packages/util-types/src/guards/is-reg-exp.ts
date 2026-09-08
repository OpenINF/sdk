// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`RegExp`](https://mdn.io/Global_Objects/RegExp) object.
 * @since 3.0.0
 * @category Text Processing
 * @param value The value to identify.
 * @returns `true` if `value` is a `RegExp`; else, `false`.
 * @example ```ts
 * isRegExp(/abc/); // ↪ true
 *
 * isRegExp('/abc/'); // ↪ false
 * ```
 */
export function isRegExp(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('RegExp')(value);
}
