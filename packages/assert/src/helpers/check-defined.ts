// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// https://github.com/microsoft/TypeScript/blob/38da7c600c83e7b31193a62495239a0fe478cb67/src/compiler/debug.ts#L169

import type { AnyFunction } from '@openinf/util-core';

import { assertIsDefined } from '../assertions/assert-is-defined';

/**
 * Asserts that `value` is defined and returns it.
 * @param value The value to check.
 * @param message The message to use in the thrown error.
 * @param stackCrawlMark The function to use as the top of the stack trace.
 * @returns `value`.
 * @throws { AssertionError } if `value` is `undefined` or `null`.
 */
export function checkDefined<T>(
  value: T | null | undefined,
  message?: string,
  stackCrawlMark?: AnyFunction
): T {
  assertIsDefined(value, message, stackCrawlMark || checkDefined);
  return value;
}
