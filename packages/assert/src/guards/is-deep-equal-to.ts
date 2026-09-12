// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

import { inspectValue } from '../helpers/inspect-value';

function isPlainObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value) as object | null;
  return prototype === null || Object.getPrototypeOf(prototype) === null;
}

function enumerableOwnKeys(value: object): PropertyKey[] {
  return Reflect.ownKeys(value).filter((key) =>
    Object.prototype.propertyIsEnumerable.call(value, key)
  );
}

function deepEqual(
  a: unknown,
  b: unknown,
  aToB: WeakMap<object, object> = new WeakMap(),
  bToA: WeakMap<object, object> = new WeakMap()
): boolean {
  if (a === b || (a !== a && b !== b)) {
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

  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  if (aIsArray !== bIsArray) {
    return false;
  }
  if (!aIsArray && (!isPlainObject(a) || !isPlainObject(b))) {
    return false;
  }

  const pairedB = aToB.get(a);
  if (pairedB !== undefined) return pairedB === b;
  const pairedA = bToA.get(b);
  if (pairedA !== undefined) return pairedA === a;
  aToB.set(a, b);
  bToA.set(b, a);

  const aRecord = a as Record<PropertyKey, unknown>;
  const bRecord = b as Record<PropertyKey, unknown>;
  const aKeys = enumerableOwnKeys(a);
  const bKeys = enumerableOwnKeys(b);

  return (
    aKeys.length === bKeys.length &&
    aKeys.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(bRecord, key) &&
        Object.prototype.propertyIsEnumerable.call(bRecord, key) &&
        deepEqual(aRecord[key], bRecord[key], aToB, bToA)
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
 * @example
 * ```ts
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
  guard.expectation = () => `deeply equal ${inspectValue(expected)}`;
  return guard;
}
