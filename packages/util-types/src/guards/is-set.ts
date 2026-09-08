// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`Set`](https://mdn.io/Global_Objects/Set).
 * @since 3.0.0
 * @category Keyed Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a `Set`; else, `false`.
 */
export function isSet(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Set')(value);
}
