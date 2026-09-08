// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { AnyFunction } from '@openinf/util-core';

import { fail } from '../helpers/fail';

/**
 * Asserts that `value` is neither `undefined` nor `null`.
 * @param value The value to check.
 * @param message An optional message to include in the thrown error.
 * @param stackCrawlMark The function to use as the top of the stack trace.
 * @throws { AssertionError } if `value` is `undefined` or `null`.
 */
export function assertIsDefined<T>(
  value: T,
  message?: string,
  stackCrawlMark?: AnyFunction
): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    fail(
      message ?? `Expected value to be defined, but received ${String(value)}`,
      stackCrawlMark || assertIsDefined
    );
  }
}
