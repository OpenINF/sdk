// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { hideStackFrames } from '../_internal/hide-stack-frames';

/**
 * Validates that `callback` is a function.
 * @param callback The value to validate.
 * @throws {TypeError} if `callback` is not a function.
 */
export const validateCallback = hideStackFrames((callback: unknown): void => {
  if (typeof callback !== 'function') {
    throw new TypeError(
      `The 'callback' argument must be of type function. Received ${typeof callback}`
    );
  }
});
