// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { AnyFunction } from '@openinf/util-core';

import { fail } from '../helpers/fail';

/**
 * Asserts that `a` is greater than or equal to `b`.
 * @param a The actual value.
 * @param b The value `a` must be greater than or equal to.
 * @param stackCrawlMark The function to use as the top of the stack trace.
 * @throws { AssertionError } if `a` is less than `b`.
 */
export function assertGreaterThanOrEqual(
  a: number,
  b: number,
  stackCrawlMark?: AnyFunction
): void {
  if (a < b) {
    fail(`Expected ${a} >= ${b}`, stackCrawlMark || assertGreaterThanOrEqual);
  }
}
