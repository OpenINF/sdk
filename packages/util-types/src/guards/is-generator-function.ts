// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`GeneratorFunction`](https://mdn.io/Global_Objects/GeneratorFunction).
 *
 * **Note:** The `GeneratorFunction` constructor is not globally accessible, but
 * can be obtained from existing instances/declarations.
 * @since 3.0.0
 * @category Control Abstraction Objects
 * @param value The value to identify.
 * @returns `true` if `value` is a `GeneratorFunction`; else, `false`.
 * @example ```ts
 * isGeneratorFunction(function* foo() {}); // ↪ true
 *
 * isGeneratorFunction(function foo() {}); // ↪ false
 * ```
 */
export function isGeneratorFunction(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('GeneratorFunction')(value);
}

// https://stackoverflow.com/a/37865170
// export function isGenerator(obj: unknown): boolean {
//   const constructor = obj?.constructor;
//   if (!constructor) return false;
//   if (
//     'GeneratorFunction' === constructor.name ||
//     'GeneratorFunction' === constructor.displayName
//   )
//     return true;
//   return false;
// }
