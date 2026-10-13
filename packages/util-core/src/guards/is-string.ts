// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '../types';

/**
 * Detects whether `value` is classified as a
 * [`String`](https://mdn.io/Global_Objects/String) primitive.
 * @since 3.0.0
 * @category Data Types and Values
 * @param value The value to identify.
 * @returns `true` if `value` is a string; else, `false`.
 * @example
 * ```ts
 * import { isString } from '@openinf/util-core';
 *
 * isString(''); // ↪ true
 *
 * isString('foo'); // ↪ true
 *
 * isString(new String('bar')); // ↪ false
 *
 * isString(/baz/); // ↪ false
 * ```
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}
(isString as Guard).expectation = 'be a String primitive';
