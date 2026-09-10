// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '../types';

/**
 * Detects whether `value` is classified as a
 * [`String`](https://mdn.io/Global_Objects/String) primitive or object.
 * @since 3.0.0
 * @category Text Processing
 * @param value The value to identify.
 * @returns `true` if `value` is a string; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isString(''); // ↪ true
 *
 * util.isString('foo'); // ↪ true
 *
 * util.isString(String('bar')); // ↪ true
 *
 * util.isString(/baz/); // ↪ false
 * ```
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}
(isString as Guard).expectation = 'be a String primitive or object';
