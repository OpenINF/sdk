// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

/**
 * Detects whether `value` conforms to the
 * [iterator protocol](https://mdn.io/iteration_protocols#the_iterator_protocol):
 * it has a `next` method, and its `Symbol.iterator` method returns itself,
 * which is what section 27.1.4.1 says an iterator does.
 *
 * This asks the value, rather than asking for an internal slot, so it calls
 * that `Symbol.iterator` method. For a particular kind of iterator, such as an
 * Array Iterator, there is a guard that reads its tag instead.
 * @since 3.0.0
 * @category Control Abstraction Objects
 * @param value The value to identify.
 * @returns `true` if `value` is an iterator; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isIterator([][Symbol.iterator]()); // ↪ true
 *
 * util.isIterator([]); // ↪ false
 * ```
 */
export function isIterator(
  value: unknown
): value is globalThis.Iterator<unknown> {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<PropertyKey, unknown>;

  return (
    typeof candidate['next'] === 'function' &&
    typeof Symbol === 'function' &&
    typeof Symbol.iterator === 'symbol' &&
    typeof candidate[Symbol.iterator] === 'function' &&
    (candidate[Symbol.iterator] as () => unknown).call(candidate) === candidate
  );
}
(isIterator as Guard).expectation = 'be an Iterator';
