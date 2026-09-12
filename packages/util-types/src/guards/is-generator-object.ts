// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`Generator`](https://mdn.io/Global_Objects/Generator) object.
 * @since 3.0.0
 * @category Control Abstraction Objects
 * @param value The value to identify.
 * @returns `true` if `value` is a `Generator`; else, `false`.
 * @example
 * ```ts
 * function* infinite() {
 *     let index = 0;
 *
 *     while (true) {
 *         yield index++;
 *     }
 * }
 *
 * const generator = infinite();
 *
 * isGeneratorObject(generator); // ↪ true
 *
 * isGeneratorObject(infinite); // ↪ false
 * ```
 */
export function isGeneratorObject(value: unknown): boolean {
  return (
    isObjectLike(value) &&
    _tagTester('Generator')(value) &&
    typeof value['next'] === 'function' &&
    typeof value['throw'] === 'function'
  );
}
