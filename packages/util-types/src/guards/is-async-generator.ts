// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as an
 * [`AsyncGenerator`](https://tc39.es/ecma262/#sec-asyncgenerator-objects).
 *
 * **Note:** The `AsyncGenerator` constructor is not globally accessible, but
 * can be obtained from existing instances/declarations.
 * This is a tag-and-shape heuristic, not an internal-brand guarantee. It
 * avoids calling ordinary getters, but a carefully constructed object or
 * proxy can produce false positives. Do not use it as a security boundary.
 * @since 3.0.0
 * @category Control Abstraction Objects
 * @param value The value to identify.
 * @returns `true` if `value` is an `AsyncGenerator`; else, `false`.
 * @example
 * ```ts
 * import { isAsyncGenerator } from '@openinf/util-types';
 *
 * async function* count() {
 *   yield 0;
 * }
 *
 * isAsyncGenerator(count()); // ↪ true
 *
 * isAsyncGenerator(count); // ↪ false
 * ```
 */
export function isAsyncGenerator(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('AsyncGenerator')(value);
}
