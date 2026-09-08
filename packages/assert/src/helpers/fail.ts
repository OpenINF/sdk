// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import type { AnyFunction } from '@openinf/util-core';

import { AssertionError } from '../errors/assertion-error';

/**
 * Throws an {@link AssertionError} with `message`, trimming the thrown
 * error's stack trace to start at `stackStartFn` when supported.
 * @param message The error message.
 * @param stackStartFn The function to use as the top of the stack trace.
 * @throws { AssertionError } always.
 */
export function fail(message?: string, stackStartFn?: AnyFunction): never {
  const error = new AssertionError(message ?? 'Assertion failed');
  if (stackStartFn) {
    Error.captureStackTrace(error, stackStartFn);
  }
  throw error;
}
