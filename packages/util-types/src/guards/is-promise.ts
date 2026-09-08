// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';
import type { Guard } from '../types';

/**
 * Detects whether `value` is classified as a
 * [`Promise`](https://mdn.io/Global_Objects/Promise).
 * @since 3.0.0
 * @category Control Abstraction Objects
 * @param value The value to identify.
 * @returns `true` if `value` is a `Promise`; else, `false`.
 * @example ```ts
 * isPromise({ then: function() {} }); // ↪ false
 *
 * isPromise(Promise.resolve(100)); // ↪ true
 *
 * isPromise(100); // ↪ false
 * ```
 */
export function isPromise(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Promise')(value);
}
(isPromise as Guard).expectation = 'be a promise object';
