// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as an
 * [`Array Iterator`](https://mdn.io/Global_Objects/Array/@@iterator), what `[].values()` and a `for...of` over an array produce, section 23.1.5 of the specification.
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
 * @returns `true` if `value` is an `Array Iterator`; else, `false`.
 * @example
 * ```ts
 * isArrayIterator([1, 2].values()); // ↪ true
 *
 * isArrayIterator([1, 2]); // ↪ false
 * ```
 */
export function isArrayIterator(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Array Iterator')(value);
}
