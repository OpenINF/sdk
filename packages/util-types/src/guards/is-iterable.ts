// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` conforms to the
 * [iterable protocol](https://mdn.io/iteration_protocols#the_iterable_protocol): it has a `Symbol.iterator` method, so `for...of` and spreading accept it.
 *
 * A primitive string is iterable, and this says `false` for it, as it does for
 * every primitive: the question it answers is whether an object offers the
 * protocol. Reading the method can run a getter the value defines, and this
 * does not call the method itself.
 * @since 3.0.0
 * @category Control Abstraction Objects
 * @param value The value to identify.
 * @returns `true` if `value` is iterable; else, `false`.
 * @example
 * ```ts
 * isIterable([1, 2]); // ↪ true
 *
 * isIterable({}); // ↪ false
 * ```
 */
export function isIterable(value: unknown): boolean {
  if (!isObjectLike(value)) return false;

  try {
    return (
      typeof (value as Record<PropertyKey, unknown>)[Symbol.iterator] ===
      'function'
    );
  } catch {
    // A getter or proxy trap that throws answers the question: nothing usable.
    return false;
  }
}
