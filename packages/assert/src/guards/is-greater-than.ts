// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

import { isComparable } from './is-comparable';

/**
 * Creates a guard that tests if a value is greater than `expected`. If the
 * value implements {@link @openinf/util!Comparable}, its `compareTo` method is used;
 * otherwise, values are compared with `>`.
 * @param expected The value to compare against.
 * @returns The guard.
 * @example
 * ```ts
 * const isGreaterThanOne = isGreaterThan(1);
 *
 * isGreaterThanOne(2); // ↪ true
 *
 * isGreaterThanOne(1); // ↪ false
 * ```
 */
export function isGreaterThan<T>(expected: T): Guard<T> {
  const guard: Guard<T> = (value: unknown): value is T =>
    isComparable(value)
      ? value.compareTo(expected) === 1
      : (value as number) > (expected as unknown as number);
  guard.expectation = () => `be greater than ${String(expected)}`;
  return guard;
}
