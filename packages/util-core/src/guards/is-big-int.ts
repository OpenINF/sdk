// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '../types';

/**
 * Detects whether `value` is classified as a
 * [`BigInt`](https://mdn.io/BigInt) primitive.
 * @since 3.0.0
 * @category Data Types and Values
 * @param value The value to identify.
 * @returns `true` if `value` is a bigint; else, `false`.
 * @example
 * ```ts
 * import { isBigInt } from '@openinf/util-core';
 *
 * isBigInt(3); // ↪ false
 *
 * isBigInt(3n); // ↪ true
 *
 * isBigInt(4.4); // ↪ false
 *
 * isBigInt(Object(5n)); // ↪ false
 * ```
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value == 'bigint';
}
(isBigInt as Guard).expectation = 'be a BigInt primitive';
