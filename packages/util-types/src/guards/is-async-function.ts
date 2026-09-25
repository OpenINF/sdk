// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as an
 * [`AsyncFunction`](https://mdn.io/Global_Objects/AsyncFunction).
 *
 * **Note:** The `AsyncFunction` constructor is not globally accessible, but can
 * be obtained from existing instances/declarations.
 * This is a tag-and-shape heuristic, not an internal-brand guarantee. It
 * avoids calling ordinary getters, but a carefully constructed object or
 * proxy can produce false positives. Do not use it as a security boundary.
 * @since 3.0.0
 * @category Control Abstraction Objects
 * @param value The value to identify.
 * @returns `true` if `value` is an `AsyncFunction`; else, `false`.
 * @example
 * ```ts
 * isAsyncFunction(async function foo() {}); // ↪ true
 *
 * isAsyncFunction(function foo() {}); // ↪ false
 * ```
 */
export function isAsyncFunction(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('AsyncFunction')(value);
}
