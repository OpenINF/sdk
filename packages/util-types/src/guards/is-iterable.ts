// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` conforms to the
 * [iterable protocol](https://mdn.io/iteration_protocols#the_iterable_protocol): it has a callable `Symbol.iterator` property, which is what `for...of` and spreading look for.
 *
 * This is the shallow question. The method is read but never called, so a
 * `Symbol.iterator` that returns something other than an iterator still passes
 * here and still throws in the loop. Nothing short of calling it can tell.
 *
 * A primitive string is iterable, and this says `false` for it, as it does for
 * every primitive: the question it answers is whether an object offers the
 * protocol. Reading the property can run a getter the value defines, and a
 * getter that throws answers `false` rather than throwing.
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
