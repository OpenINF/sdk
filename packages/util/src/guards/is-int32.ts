// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard, Tagged } from '@openinf/util-core';

/**
 * A value that is an Int32.
 */
export type Int32 = Tagged<number, '__Int32__'>;

/**
 * Detects whether `value` is classified as an `Int32`.
 * @since 3.0.0
 * @category Numbers & Dates
 * @param value The value to be identified.
 * @returns `true` if `value` is an int32; else, `false`.
 * @example
 * ```ts
 * import { isInt32 } from '@openinf/util';
 *
 * isInt32(123); // ↪ true
 *
 * isInt32('123'); // ↪ false
 * ```
 */
export function isInt32(value: unknown): value is Int32 {
  return typeof value === 'number' && value === (value | 0);
}
(isInt32 as Guard).expectation = 'be an Int32';
