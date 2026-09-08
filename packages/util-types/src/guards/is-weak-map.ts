// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`WeakMap`](https://mdn.io/Global_Objects/WeakMap).
 * @since 3.0.0
 * @category Keyed Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a `WeakMap`; else, `false`.
 */
export function isWeakMap(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('WeakMap')(value);
}
