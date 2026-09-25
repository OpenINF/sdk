// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as a
 * [`GeneratorFunction`](https://mdn.io/Global_Objects/GeneratorFunction).
 *
 * **Note:** The `GeneratorFunction` constructor is not globally accessible, but
 * can be obtained from existing instances/declarations.
 * This is a tag-and-shape heuristic, not an internal-brand guarantee. It
 * avoids calling ordinary getters, but a carefully constructed object or
 * proxy can produce false positives. Do not use it as a security boundary.
 * @since 3.0.0
 * @category Control Abstraction Objects
 * @param value The value to identify.
 * @returns `true` if `value` is a `GeneratorFunction`; else, `false`.
 * @example
 * ```ts
 * isGeneratorFunction(function* foo() {}); // ↪ true
 *
 * isGeneratorFunction(function foo() {}); // ↪ false
 * ```
 */
export function isGeneratorFunction(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('GeneratorFunction')(value);
}
