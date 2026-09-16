// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` conforms to the
 * [async iterable protocol](https://mdn.io/Reference/Statements/for-await...of): it has a `Symbol.asyncIterator` method, so `for await...of` accepts it.
 *
 * A primitive string is iterable, and this says `false` for it, as it does for
 * every primitive: the question it answers is whether an object offers the
 * protocol. Reading the method can run a getter the value defines, and this
 * does not call the method itself.
 * @since 3.0.0
 * @category Control Abstraction Objects
 * @param value The value to identify.
 * @returns `true` if `value` is async iterable; else, `false`.
 * @example
 * ```ts
 * isAsyncIterable((async function* () {})()); // ↪ true
 *
 * isAsyncIterable({}); // ↪ false
 * ```
 */
export function isAsyncIterable(value: unknown): boolean {
  if (!isObjectLike(value)) return false;

  try {
    return (
      typeof (value as Record<PropertyKey, unknown>)[Symbol.asyncIterator] ===
      'function'
    );
  } catch {
    // A getter or proxy trap that throws answers the question: nothing usable.
    return false;
  }
}
