// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

import { isEquatable } from './is-equatable';

/**
 * Creates a guard that tests if a value is equal to `expected`. If
 * `expected` implements {@link @openinf/util!Equatable}, its `equals` method is used;
 * otherwise, values are compared with `===`.
 * @param expected The value to compare against.
 * @returns The guard.
 * @example
 * ```ts
 * const isEqualToOne = isEqualTo(1);
 *
 * isEqualToOne(1); // ↪ true
 *
 * isEqualToOne(2); // ↪ false
 * ```
 */
export function isEqualTo<T>(expected: T): Guard<T> {
  const guard: Guard<T> = (value: unknown): value is T =>
    isEquatable(expected) ? expected.equals(value) : value === expected;
  guard.expectation = () => `equal ${String(expected)}`;
  return guard;
}
