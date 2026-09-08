// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { AnyFunction } from '@openinf/util-core';

import { fail } from '../helpers/fail';

/**
 * Asserts that `a` is strictly equal (`===`) to `b`.
 * @param a The actual value.
 * @param b The expected value.
 * @param msg An optional message to include in the thrown error.
 * @param msg2 An optional second message to append to `msg`.
 * @param stackCrawlMark The function to use as the top of the stack trace.
 * @throws { AssertionError } if `a` is not strictly equal to `b`.
 */
export function assertEqual<T>(
  a: T,
  b: T,
  msg?: string,
  msg2?: string,
  stackCrawlMark?: AnyFunction
): void {
  if (a !== b) {
    const message = msg ? (msg2 ? `${msg} ${msg2}` : msg) : '';
    fail(
      `Expected ${String(a)} === ${String(b)}. ${message}`,
      stackCrawlMark || assertEqual
    );
  }
}
