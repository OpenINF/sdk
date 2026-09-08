// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }

  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  ) {
    return false;
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((item, i) => deepEqual(item, b[i]))
    );
  }

  const aRecord = a as Record<string, unknown>;
  const bRecord = b as Record<string, unknown>;
  const aKeys = Object.keys(aRecord);
  const bKeys = Object.keys(bRecord);

  return (
    aKeys.length === bKeys.length &&
    aKeys.every(
      (key) => key in bRecord && deepEqual(aRecord[key], bRecord[key])
    )
  );
}

/**
 * Creates a guard that tests if a value is deeply, structurally equal to
 * `expected`: primitives are compared with
 * [`SameValueZero`](https://mdn.io/Equality_comparisons_and_sameness#same-value-zero_equality),
 * and arrays/plain objects are compared recursively, own-property by
 * own-property.
 * @param expected The value to compare against.
 * @returns The guard.
 * @example ```ts
 * const isDeepEqualToFoo = isDeepEqualTo({ a: [1, 2] });
 *
 * isDeepEqualToFoo({ a: [1, 2] }); // ↪ true
 *
 * isDeepEqualToFoo({ a: [1, 3] }); // ↪ false
 * ```
 */
export function isDeepEqualTo<T>(expected: T): Guard<T> {
  const guard: Guard<T> = (value: unknown): value is T =>
    deepEqual(value, expected);
  guard.expectation = () => `deeply equal ${JSON.stringify(expected)}`;
  return guard;
}
