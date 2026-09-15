// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { _tagTester, isObjectLike, type Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as a
 * [`String`](https://mdn.io/Global_Objects/String) boxed primitive object.
 * @since 3.0.0
 * @category Text Processing
 * @param value The value to identify.
 * @returns `true` if `value` is a `String` object; else, `false`.
 * @example
 * ```ts
 * isStringObject(new String('Foo')); // ↪ true
 *
 * isStringObject('Foo'); // ↪ false
 * ```
 */
export function isStringObject(
  value: unknown
): value is object & { valueOf(): string } {
  return isObjectLike(value) && _tagTester('String')(value);
}
(isStringObject as Guard).expectation = 'be a String object';
