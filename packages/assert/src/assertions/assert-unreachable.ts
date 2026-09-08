// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield

import { AssertionError } from '../errors/assertion-error';

/**
 * Asserts that the given call is never reached. Will always throw if called.
 * Useful for ending branches that TypeScript can't properly determine
 * @param msg The message to throw
 * @throws { AssertionError } always.
 */
export function assertUnreachable(
  msg: string = 'Statement should not be reachable'
): never {
  throw new AssertionError(msg);
}
