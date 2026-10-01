// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Validator } from '@openinf/util-core';

import { _compareRelational } from '../_internal/_compare-relational';
import { _stringifyValue } from '../_internal/_stringify-value';
import { isComparable } from './is-comparable';

/**
 * Creates a validator that tests if a value is less than or equal to `expected`.
 * If the value implements {@link @openinf/util!Comparable}, its `compareTo` method is
 * used; otherwise, strings, numbers, or bigints of the same type are compared.
 * @param expected The value to compare against.
 * @returns The validator.
 * @example
 * ```ts
 * const isAtMostOne = isLessThanOrEqualTo(1);
 *
 * isAtMostOne(1); // ↪ true
 *
 * isAtMostOne(2); // ↪ false
 * ```
 */
export function isLessThanOrEqualTo(expected: unknown): Validator {
  const validator: Validator = (value: unknown): boolean => {
    const result = isComparable(value)
      ? value.compareTo(expected)
      : _compareRelational(value, expected);
    return result === 0 || result === -1;
  };
  validator.expectation = () =>
    `be less than or equal to ${_stringifyValue(expected)}`;
  return validator;
}
