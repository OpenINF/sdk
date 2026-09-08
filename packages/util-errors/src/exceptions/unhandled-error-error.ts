// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js. Copyright Joyent, Inc. and other Node contributors.

import { NodeError } from '../abstractions/node-error';

/**
 * Thrown in case an unhandled error occurred (for instance, when an 'error'
 * event is emitted by an EventEmitter without an 'error' handler registered).
 * @see https://nodejs.org/api/errors.html#ERR_UNHANDLED_ERROR
 */
export class UnhandledErrorError extends NodeError {
  // The default argument (rather than `?`) is required so the parameter is
  // not counted toward `Function#length`; `?` has no runtime effect on that.
  // oxlint-disable-next-line typescript/no-useless-default-assignment
  public constructor(err: string | undefined = undefined) {
    const msg = 'Unhandled error.';
    super('ERR_UNHANDLED_ERROR', err === undefined ? msg : `${msg} (${err})`);
    this.name = 'UnhandledErrorError';
  }
}
