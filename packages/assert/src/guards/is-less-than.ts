// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

import { isComparable } from './is-comparable';

/**
 * Creates a guard that tests if a value is less than `expected`. If the
 * value implements {@link @openinf/util!Comparable}, its `compareTo` method is used;
 * otherwise, values are compared with `<`.
 * @param expected The value to compare against.
 * @returns The guard.
 * @example ```ts
 * const isLessThanOne = isLessThan(1);
 *
 * isLessThanOne(0); // ↪ true
 *
 * isLessThanOne(1); // ↪ false
 * ```
 */
export function isLessThan<T>(expected: T): Guard<T> {
  const guard: Guard<T> = (value: unknown): value is T =>
    isComparable(value)
      ? value.compareTo(expected) === -1
      : (value as number) < (expected as unknown as number);
  guard.expectation = () => `be less than ${String(expected)}`;
  return guard;
}
