// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '../types';

/**
 * Detects whether `value` is classified as a `Symbol` primitive.
 * @since 3.0.0
 * @category Data Types and Values
 * @param value The value to be identified.
 * @returns `true` if `value` is a symbol; else, `false`.
 * @example
 * ```ts
 * import { isSymbol } from '@openinf/util-core';
 *
 * isSymbol('@#$%&!'); // ↪ false
 *
 * isSymbol(Symbol('foo')); // ↪ true
 *
 * isSymbol(Symbol.iterator); // ↪ true
 *
 * isSymbol(Object(Symbol('foo'))); // ↪ false
 * ```
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}
(isSymbol as Guard).expectation = 'be a Symbol primitive';
