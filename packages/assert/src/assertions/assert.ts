// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield.

import { AssertionError } from '../errors/assertion-error';

/**
 * Asserts that an expression evaluates to `true` or throws an error if not.
 * @param expression An expression to assert is true.
 * @param msg The message to use in the thrown error. Accepts a function that
 * can be called to generate the message to improve performance.
 * @throws { AssertionError } if `expression` does not evaluate to `true`.
 */
export function assert(
  expression: unknown,
  msg?: string | (() => string)
): asserts expression {
  if (expression !== true) {
    // Only call the message function if the expression doesn't evaluate to true.
    if (typeof msg === 'function') msg = msg();
    throw new AssertionError(msg ?? 'Assertion failed');
  }
}
