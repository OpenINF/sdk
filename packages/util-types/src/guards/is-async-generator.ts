// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as an
 * [`AsyncGenerator`](https://tc39.es/ecma262/#sec-asyncgenerator-objects).
 *
 * **Note:** The `AsyncGenerator` constructor is not globally accessible, but
 * can be obtained from existing instances/declarations.
 * @since 3.0.0
 * @category Control Abstraction Objects
 * @param value The value to identify.
 * @returns `true` if `value` is an `AsyncGenerator`; else, `false`.
 * @example
 * ```ts
 * Object.getPrototypeOf(async function* () { yield 0; });
 * globalThis.AsyncGenerator = Object.getPrototypeOf(async function* () {});
 * isAsyncGenerator(new AsyncGenerator()); //=> true
 * ```
 */
export function isAsyncGenerator(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('AsyncGenerator')(value);
}
