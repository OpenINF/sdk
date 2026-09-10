// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield
// https://github.com/dtjohnson/typeshield/blob/master/src/guards/and.ts

import type { Guard } from '@openinf/util-core';

function expectationOf(guard: Guard): string {
  return typeof guard.expectation === 'function'
    ? guard.expectation()
    : (guard.expectation ?? 'be valid');
}

export function and<T1, T2>(
  guard1: Guard<T1>,
  guard2: Guard<T2>
): Guard<T1 & T2>;
export function and<T1, T2, T3>(
  guard1: Guard<T1>,
  guard2: Guard<T2>,
  guard3: Guard<T3>
): Guard<T1 & T2 & T3>;
export function and<T1, T2, T3, T4>(
  guard1: Guard<T1>,
  guard2: Guard<T2>,
  guard3: Guard<T3>,
  guard4: Guard<T4>
): Guard<T1 & T2 & T3 & T4>;
/**
 * Combines guards into a guard that tests if a value satisfies every one of
 * them.
 * @param guards The guards to combine.
 * @returns A guard that tests if a value satisfies all of `guards`.
 * @example
 * ```ts
 * import { and, isNumber, isPositive } from '@openinf/util';
 *
 * const isPositiveNumber = and(isNumber, isPositive);
 *
 * isPositiveNumber(1); // ↪ true
 *
 * isPositiveNumber(-1); // ↪ false
 * ```
 */
export function and(...guards: Guard[]): Guard {
  const guard: Guard = (value: unknown): value is unknown =>
    guards.every((g) => g(value));
  guard.expectation = () => guards.map(expectationOf).join(' and ');
  return guard;
}
