// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

/**
 * Creates a guard that tests if a value is identical to `expected`, using
 * [`SameValueZero`](https://mdn.io/Equality_comparisons_and_sameness#same-value-zero_equality)
 * comparison. Unlike {@link isEqualTo}, this never delegates to an
 * `Equatable`'s `equals` method.
 * @param expected The value to compare against.
 * @returns The guard.
 * @example ```ts
 * const isIdenticalToFoo = isIdenticalTo('foo');
 *
 * isIdenticalToFoo('foo'); // ↪ true
 *
 * isIdenticalToFoo(NaN); // ↪ false
 * ```
 */
export function isIdenticalTo<T>(expected: T): Guard<T> {
  const guard: Guard<T> = (value: unknown): value is T =>
    value === expected || (value !== value && expected !== expected);
  guard.expectation = () => `be identical to ${String(expected)}`;
  return guard;
}
