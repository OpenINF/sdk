// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isObjectLike } from '@openinf/util-core';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`Map`](https://mdn.io/Global_Objects/Map).
 * @since 3.0.0
 * @category Keyed Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a `Map`; else, `false`.
 */
export function isMap(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Map')(value);
}
