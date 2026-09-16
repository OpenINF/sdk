// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is
 * a [`WeakRef`](https://mdn.io/Global_Objects/WeakRef), which holds a value without keeping it alive, section 26.1 of the specification.
 *
 * The check asks for the internal slots only `WeakRef` gives an object,
 * through a probe that leaves the value as it found it, so an object carrying
 * `Symbol.toStringTag` does not pass. In a runtime without `WeakRef`,
 * nothing does.
 * @since 3.0.0
 * @category Managing Memory
 * @param value The value to identify.
 * @returns `true` if `value` is a `WeakRef`; else, `false`.
 * @example
 * ```ts
 * isWeakRef(new WeakRef({})); // ↪ true
 *
 * isWeakRef({}); // ↪ false
 * ```
 */
export function isWeakRef(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('WeakRef')(value);
}
