// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Validator } from '@openinf/util-core';

import { _compareRelational } from '../_internal/_compare-relational';
import { isComparable } from './is-comparable';

/**
 * Creates a validator that tests if a value is greater than `expected`. If the
 * value implements {@link @openinf/util!Comparable}, its `compareTo` method is used;
 * otherwise, strings, numbers, or bigints of the same type are compared.
 * @param expected The value to compare against.
 * @returns The validator.
 * @example
 * ```ts
 * const isGreaterThanOne = isGreaterThan(1);
 *
 * isGreaterThanOne(2); // ↪ true
 *
 * isGreaterThanOne(1); // ↪ false
 * ```
 */
export function isGreaterThan(expected: unknown): Validator {
  const validator: Validator = (value: unknown): boolean =>
    isComparable(value)
      ? value.compareTo(expected) === 1
      : _compareRelational(value, expected) === 1;
  validator.expectation = () => `be greater than ${String(expected)}`;
  return validator;
}
