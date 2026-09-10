// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isNumber } from '@openinf/util-core';
import type { Guard, Tagged } from '@openinf/util-core';

/**
 * A number that is finite.
 */
export type FiniteNumber = Tagged<number, '__FiniteNumber__'>;

/**
 * Detects whether `value` is a finite
 * [`Number`](https://mdn.io/Global_Objects/Number), i.e. neither
 * [`NaN`](https://mdn.io/Global_Objects/NaN) nor `Infinity`/`-Infinity`.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is a finite number; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isFiniteNumber(0); // ↪ true
 *
 * util.isFiniteNumber(Infinity); // ↪ false
 *
 * util.isFiniteNumber(NaN); // ↪ false
 *
 * util.isFiniteNumber('0'); // ↪ false
 * ```
 */
export function isFiniteNumber(value: unknown): value is FiniteNumber {
  return isNumber(value) && Number.isFinite(value);
}
(isFiniteNumber as Guard).expectation = 'be a finite number';
