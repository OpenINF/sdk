// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as an
 * [`AsyncFunction`](https://mdn.io/Global_Objects/AsyncFunction).
 *
 * **Note:** The `AsyncFunction` constructor is not globally accessible, but can
 * be obtained from existing instances/declarations.
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
