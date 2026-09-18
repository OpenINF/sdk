// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as an
 * [`RegExp String Iterator`](https://mdn.io/Global_Objects/String/matchAll), what `String.prototype.matchAll` returns, section 22.2.9 of the specification.
 *
 * Like the Map and Set iterator guards, this is a tag-and-shape heuristic
 * rather than an internal-brand guarantee: the language exposes no probe for
 * these, and the only non-mutating alternative would be to call `next`, which
 * advances the iterator. It avoids calling ordinary getters, but a carefully
 * constructed object or proxy can produce a false positive. Do not use it as a
 * security boundary.
 * @since 3.0.0
 * @category Control Abstraction Objects
 * @param value The value to identify.
 * @returns `true` if `value` is an `RegExp String Iterator`; else, `false`.
 * @example
 * ```ts
 * isRegExpStringIterator("aa".matchAll(/a/g)); // ↪ true
 *
 * isRegExpStringIterator([1, 2]); // ↪ false
 * ```
 */
export function isRegExpStringIterator(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('RegExp String Iterator')(value);
}
