// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

/**
 * Marks a function as one whose own stack frame should be hidden from
 * generated error stack traces. Node's real implementation relies on a V8
 * binding with no pure-JS equivalent, so this is an identity function that
 * exists only for parity with `internal/errors.js`'s `hideStackFrames`.
 * @private
 * @param fn The function to wrap.
 * @returns `fn`, unchanged.
 */
export function hideStackFrames<T extends (...args: any[]) => any>(fn: T): T {
  return fn;
}
