// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { AnyFunction, Guard } from '../types';

/**
 * Detects whether `value` is classified as a
 * [`Function`](https://mdn.io/Global_Objects/Function) object.
 * @since 3.0.0
 * @category Fundamental Objects
 * @param value The value to identify.
 * @returns `true` if `value` is a function; else, `false`.
 * @example ```ts
 * import util from '@openinf/util';
 *
 * util.isFunction(class foo {}); // ↪ true
 *
 * util.isFunction(() => {}); // ↪ true
 *
 * util.isFunction(async () => {}); // ↪ true
 *
 * util.isFunction(function* bar() {}); // ↪ true
 *
 * util.isFunction(Math.round); // ↪ true
 *
 * util.isFunction(/abc/); // ↪ false
 * ```
 */
export function isFunction(value: unknown): value is AnyFunction {
  return typeof value === 'function';
}
(isFunction as Guard).expectation = 'be a Function object';
