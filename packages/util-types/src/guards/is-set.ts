// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

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
