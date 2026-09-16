// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { isObjectLike } from '@openinf/util-core';

const { keyFor } = Symbol;

/**
 * Detects whether `value` can be held weakly, the CanBeHeldWeakly operation of
 * section 9.13 of the specification: whether `WeakRef`, `WeakMap`, `WeakSet`
 * and `FinalizationRegistry` will take it, rather than throwing a `TypeError`.
 *
 * Every object qualifies, functions among them. So does a symbol, unless it is
 * one `Symbol.for` put in the global registry, which lives as long as the
 * realm and so could never be collected. A well-known symbol such as
 * `Symbol.iterator` is not registered, and does qualify. Nothing else does.
 * @since 3.0.0
 * @category Managing Memory
 * @param value The value to identify.
 * @returns `true` if `value` can be held weakly; else, `false`.
 * @example
 * ```ts
 * canBeHeldWeakly({}); // ↪ true
 *
 * canBeHeldWeakly(Symbol('unregistered')); // ↪ true
 *
 * canBeHeldWeakly(Symbol.for('registered')); // ↪ false
 *
 * canBeHeldWeakly('a string'); // ↪ false
 * ```
 */
export function canBeHeldWeakly(value: unknown): boolean {
  return (
    isObjectLike(value) ||
    (typeof value === 'symbol' && keyFor(value) === undefined)
  );
}
