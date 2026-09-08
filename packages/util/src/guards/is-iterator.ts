// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

/**
 * Detects whether `value` conforms to the
 * [iterator protocol](https://mdn.io/iteration_protocols#the_iterator_protocol).
 * @since 3.0.0
 * @category Other
 * @param value The value to identify.
 * @returns `true` if `value` is an iterator; else, `false`.
 * @example ```ts
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

  if (candidate['__shouldIterator__']) {
    return true;
  }

  return (
    typeof candidate['next'] === 'function' &&
    typeof Symbol === 'function' &&
    typeof Symbol.iterator === 'symbol' &&
    typeof candidate[Symbol.iterator] === 'function' &&
    (candidate[Symbol.iterator] as () => unknown).call(candidate) === candidate
  );
}
(isIterator as Guard).expectation = 'be an Iterator';
