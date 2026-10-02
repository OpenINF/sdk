// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

/**
 * Detects whether `value` conforms to the
 * [iterator protocol](https://mdn.io/iteration_protocols#the_iterator_protocol):
 * it has a `next` method. An iterator does not have to be iterable; use
 * {@link isIterable} when a `Symbol.iterator` method is also required.
 * This shallow check does not call `next`, inspect its result, or validate
 * optional methods, so it returns a boolean without narrowing to `Iterator`.
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
export function isIterator(value: unknown): boolean {
  if (
    value === null ||
    (typeof value !== 'object' && typeof value !== 'function')
  ) {
    return false;
  }

  try {
    return typeof (value as { next?: unknown }).next === 'function';
  } catch {
    return false;
  }
}
(isIterator as Guard).expectation = 'be an Iterator';
