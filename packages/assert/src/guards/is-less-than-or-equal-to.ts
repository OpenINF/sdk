// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

import { isComparable } from './is-comparable';

/**
 * Creates a guard that tests if a value is less than or equal to `expected`.
 * If the value implements {@link @openinf/util!Comparable}, its `compareTo` method is
 * used; otherwise, values are compared with `<=`.
 * @param expected The value to compare against.
 * @returns The guard.
 * @example ```ts
 * const isAtMostOne = isLessThanOrEqualTo(1);
 *
 * isAtMostOne(1); // ↪ true
 *
 * isAtMostOne(2); // ↪ false
 * ```
 */
export function isLessThanOrEqualTo<T>(expected: T): Guard<T> {
  const guard: Guard<T> = (value: unknown): value is T => {
    if (isComparable(value)) {
      const result = value.compareTo(expected);
      return result === 0 || result === -1;
    }
    return (value as number) <= (expected as unknown as number);
  };
  guard.expectation = () => `be less than or equal to ${String(expected)}`;
  return guard;
}
