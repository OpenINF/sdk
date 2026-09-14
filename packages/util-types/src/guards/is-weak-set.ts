// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is classified as a
 * [`WeakSet`](https://mdn.io/Global_Objects/WeakSet).
 * @since 3.0.0
 * @category Keyed Collections
 * @param value The value to identify.
 * @returns `true` if `value` is a `WeakSet`; else, `false`.
 */
export function isWeakSet(value: unknown): boolean {
  return _tagTester('WeakSet')(value);
}
