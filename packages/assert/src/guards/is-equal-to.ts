// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Validator } from '@openinf/util-core';

import { _stringifyValue } from '../_internal/_stringify-value';
import { isEquatable } from './is-equatable';

/**
 * Creates a validator that tests if a value is equal to `expected`. If
 * `expected` implements {@link @openinf/util!Equatable}, its `equals` method is used;
 * otherwise, values are compared with `===`.
 * Equality does not establish a type: an `equals` method can accept another
 * type, and a different value can still have the expected value's type.
 * @param expected The value to compare against.
 * @returns The validator.
 * @example
 * ```ts
 * const isEqualToOne = isEqualTo(1);
 *
 * isEqualToOne(1); // ↪ true
 *
 * isEqualToOne(2); // ↪ false
 * ```
 */
export function isEqualTo(expected: unknown): Validator {
  const guard: Validator = (value: unknown): boolean =>
    isEquatable(expected) ? expected.equals(value) : value === expected;
  guard.expectation = () => `equal ${_stringifyValue(expected)}`;
  return guard;
}
