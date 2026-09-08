// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import { getMessage } from '../helpers/get-message';

/**
 * Options accepted by the {@link AssertionError} constructor.
 */
export interface AssertionErrorConstructorOptions {
  /**
   * The value that was actually produced.
   */
  actual?: unknown;
  /**
   * The value that was expected.
   */
  expected?: unknown;
  /**
   * A description of the comparison that failed, e.g. `'=='` or
   * `'deepEqual'`.
   */
  operator?: string;
}

/**
 * Indicates the failure of an assertion. All errors thrown by this package
 * are instances of `AssertionError`.
 */
export class AssertionError extends Error {
  public actual: unknown;
  public code = 'ERR_ASSERTION';
  public expected: unknown;
  public operator?: string | undefined;

  /**
   * Creates an `AssertionError`.
   * @param message The error message. Defaults to a message generated from
   * `options`.
   * @param options Options describing the failed comparison.
   */
  public constructor(
    message?: string,
    options: AssertionErrorConstructorOptions = {}
  ) {
    super(message ?? getMessage(options));
    this.actual = options.actual;
    this.expected = options.expected;
    this.operator = options.operator;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'AssertionError';
  }

  public override toString(): string {
    return `${this.name} [${this.code}]: ${this.message}`;
  }
}
