// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { inspectValue } from './inspect-value';

/**
 * The subset of {@link AssertionErrorConstructorOptions} needed to build a
 * default message.
 */
export interface MessageOptions {
  actual?: unknown;
  expected?: unknown;
  operator?: string;
}

/**
 * Builds a default `AssertionError` message from the actual/expected values
 * and the comparison operator that failed.
 * @param options The failed comparison to describe.
 * @returns The generated message.
 */
export function getMessage(options: MessageOptions): string {
  if (!options.operator) {
    return 'Assertion failed';
  }

  return `Expected ${inspectValue(options.actual)} ${
    options.operator
  } ${inspectValue(options.expected)}`;
}
