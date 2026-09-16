// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import type { Guard } from '@openinf/util-core';

const { apply } = Reflect;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const isWellFormed = String.prototype.isWellFormed;

/**
 * Detects whether `value` is a well-formed string: one that contains no lone
 * surrogates, section 22.1 of the specification.
 *
 * A JavaScript string is a sequence of 16-bit code units, not of characters,
 * so it can hold a surrogate with no partner. Such a string has no valid UTF-8
 * encoding, and anything that has to encode it, `encodeURI` and
 * `TextEncoder` among them, either throws or substitutes the replacement
 * character. Asking first is how to find out before that happens.
 *
 * A `String` object is refused, as it is by the other guards here; only a
 * primitive passes.
 * @since 3.0.0
 * @category Text Processing
 * @param value The value to identify.
 * @returns `true` if `value` is a well-formed string; else, `false`.
 * @example
 * ```ts
 * isWellFormedString('a😀b'); // ↪ true, a paired surrogate
 *
 * isWellFormedString('a\uD800b'); // ↪ false, a lone high surrogate
 *
 * isWellFormedString(''); // ↪ true
 * ```
 */
export function isWellFormedString(value: unknown): value is string {
  return typeof value === 'string' && apply(isWellFormed, value, []);
}
(isWellFormedString as Guard).expectation = 'be a well-formed string';
