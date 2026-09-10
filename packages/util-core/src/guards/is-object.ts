// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '../types';

/**
 * Detects whether `value` is strictly an `Object` **and** _not_ a `Function`
 * (even though functions are objects in JavaScript).
 * @since 3.0.0
 * @category Fundamental Objects
 * @param value The value to identify.
 * @returns `true` if `value` is an object; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isObject({}); // ↪ true
 *
 * util.isObject(null); // ↪ false
 *
 * util.isObject(() => {}); // ↪ false
 * ```
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}
(isObject as Guard).expectation = 'be an Object';
