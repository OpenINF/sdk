// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isBigIntObject } from './is-big-int-object';
import { isBooleanObject } from './is-boolean-object';
import { isNumberObject } from './is-number-object';
import { isStringObject } from './is-string-object';
import { isSymbolObject } from './is-symbol-object';

/**
 * Detects whether `value` is a primitive wrapped by its object equivalent
 * (a.k.a. "boxed"). Except for `null` and `undefined`, all primitive values
 * have object equivalents that wrap their primitive value counterparts:
 *
 * - [`Boolean`](https://mdn.io/Global_Objects/Boolean)
 * - [`String`](https://mdn.io/Global_Objects/String)
 * - [`Number`](https://mdn.io/Global_Objects/Number)
 * - [`Symbol`](https://mdn.io/Global_Objects/Symbol)
 * - [`BigInt`](https://mdn.io/Global_Objects/BigInt)
 * @since 3.0.0
 * @category Other
 * @param value The value to identify.
 * @returns `true` if `value` is a boxed primitive; else, `false`.
 * @example
 * ```ts
 * isBoxedPrimitive(false); // ↪ false
 *
 * isBoxedPrimitive(new Boolean(true)); // ↪ true
 *
 * isBoxedPrimitive(new Number(0)); // ↪ true
 *
 * isBoxedPrimitive(0); // ↪ false
 * ```
 */
export function isBoxedPrimitive(value: unknown): boolean {
  // has valueOf method
  return (
    isBooleanObject(value) ||
    isStringObject(value) ||
    isNumberObject(value) ||
    isSymbolObject(value) ||
    isBigIntObject(value)
  );
}
