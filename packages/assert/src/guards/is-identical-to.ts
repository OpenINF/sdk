// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Validator } from '@openinf/util-core';

import { _stringifyValue } from '../_internal/_stringify-value';

/**
 * Creates a validator that tests if a value is identical to `expected`, using
 * [`SameValueZero`](https://mdn.io/Equality_comparisons_and_sameness#same-value-zero_equality)
 * comparison. Unlike {@link isEqualTo}, this never delegates to an
 * `Equatable`'s `equals` method.
 * A different value can have the same type, so this does not narrow either
 * branch to or away from the expected value's type.
 * @param expected The value to compare against.
 * @returns The validator.
 * @example
 * ```ts
 * const isIdenticalToFoo = isIdenticalTo('foo');
 *
 * isIdenticalToFoo('foo'); // ↪ true
 *
 * isIdenticalToFoo(NaN); // ↪ false
 * ```
 */
export function isIdenticalTo(expected: unknown): Validator {
  const guard: Validator = (value: unknown): boolean =>
    value === expected || (value !== value && expected !== expected);
  guard.expectation = () => `be identical to ${_stringifyValue(expected)}`;
  return guard;
}
