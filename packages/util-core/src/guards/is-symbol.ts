// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '../types';

/**
 * Detects whether `value` is classified as a `Symbol` primitive or object.
 * @since 3.0.0
 * @category Fundamental Objects
 * @param value The value to be identified.
 * @returns `true` if `value` is a symbol; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isSymbol('@#$%&!'); // ↪ false
 *
 * util.isSymbol(Symbol('foo')); // ↪ true
 *
 * util.isSymbol(Symbol.iterator); // ↪ true
 * ```
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}
(isSymbol as Guard).expectation = 'be a `Symbol` primitive or object';
