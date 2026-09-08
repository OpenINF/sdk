// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`Symbol`](https://mdn.io/Global_Objects/Symbol) boxed primitive object.
 * @since 3.0.0
 * @category Fundamental Objects
 * @param value The value to be identified.
 * @returns `true` if `value` is a `Symbol` object; else, `false`.
 * @example ```ts
 * isSymbolObject(Symbol.iterator); // ↪ false
 *
 * isSymbolObject(Symbol('foo')); // ↪ false
 *
 * isSymbolObject(Object(Symbol('foo'))); // ↪ true
 * ```
 */
export function isSymbolObject(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Symbol')(value);
}
