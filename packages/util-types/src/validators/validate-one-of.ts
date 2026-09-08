// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { hideStackFrames } from '../_internal/hide-stack-frames';

/**
 * Validates that `value` is one of the values in `oneOf`.
 * @param value The value to validate.
 * @param name The name to use in the thrown error message.
 * @param oneOf The allowed values.
 * @throws {TypeError} if `value` is not one of `oneOf`.
 */
export const validateOneOf = hideStackFrames(
  (value: unknown, name: string, oneOf: readonly unknown[]): void => {
    if (!oneOf.includes(value)) {
      const allowed = oneOf
        .map((v) => (typeof v === 'string' ? `'${v}'` : String(v)))
        .join(', ');
      const received = typeof value === 'string' ? `'${value}'` : String(value);
      throw new TypeError(
        `The '${name}' argument must be one of: ${allowed}. Received ${received}`
      );
    }
  }
);
