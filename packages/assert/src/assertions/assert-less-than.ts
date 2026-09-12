// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { AnyFunction } from '@openinf/util-core';

import { fail } from '../helpers/fail';

/**
 * Asserts that `a` is strictly less than `b`.
 * @param a The actual value.
 * @param b The value `a` must be less than.
 * @param msg An optional message to include in the thrown error.
 * @param stackCrawlMark The function to use as the top of the stack trace.
 * @throws { AssertionError } if `a` is greater than or equal to `b`.
 */
export function assertLessThan(
  a: number,
  b: number,
  msg?: string,
  stackCrawlMark?: AnyFunction
): void {
  if (!(a < b)) {
    fail(
      `Expected ${a} < ${b}. ${msg || ''}`,
      stackCrawlMark || assertLessThan
    );
  }
}
