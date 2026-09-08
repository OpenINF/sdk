// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield

import { isFunction } from '@openinf/util-core';
import type { Guard, Validator } from '@openinf/util-core';
import { curlyQuote } from '@openinf/util-text';

import { AssertionError } from '../errors/assertion-error';

/**
 * The maximum length to show of the stringified value
 * @ignore
 */
const maxValueStrLength = 150;

function expectationOf(validator: Validator): string {
  return typeof validator.expectation === 'function'
    ? validator.expectation()
    : (validator.expectation ?? 'be valid');
}

/**
 * Asserts that a value satisfies a provided guard and is therefore of the type
 * returned by the guard.
 * @param guard The guard to call with the value.
 * @param value The value to check.
 * @param name An optional name for the value to use in the error message.
 * @param expectation An optional expectation string to use in the error
 * message. Will override the expectation string attached to the guard.
 */
export function assertValue<T>(
  guard: Guard<T> | (() => Guard<T>),
  value: unknown,
  name?: string,
  expectation?: string
): asserts value is T;
/**
 * Asserts that a value satisfies a provided validator.
 * @param validator The validator to call with the value.
 * @param value The value to check.
 * @param name An optional name for the value to be used in the error message.
 * @param expectation An optional expectation string to use in the error
 * message. Will override the expectation string attached to the guard.
 */
export function assertValue(
  validator: Validator | (() => Validator),
  value: unknown,
  name?: string,
  expectation?: string
): void;
export function assertValue(
  validator: Validator | (() => Validator),
  value: unknown,
  name?: string,
  expectation?: string
): void {
  let resolvedValidator = validator as Validator;
  let result: unknown = resolvedValidator(value);

  if (isFunction(result)) {
    resolvedValidator = result as Validator;
    result = resolvedValidator(value);
  }

  if (!result) {
    let valueStr = String(value);
    if (valueStr === '[object Object]') valueStr = JSON.stringify(value);
    if (valueStr.length > maxValueStrLength) {
      valueStr = `${valueStr.slice(0, maxValueStrLength)}...`;
    }

    throw new AssertionError(
      `Expected ${name ? curlyQuote(name) : 'value'} to ${
        expectation ?? expectationOf(resolvedValidator)
      } but received: ${valueStr}`
    );
  }
}
