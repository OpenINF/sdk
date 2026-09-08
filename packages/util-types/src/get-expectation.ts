// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield

import type { Validator } from './types';

/**
 * Gets the expectation message from a validator.
 * @ignore
 * @param validator A validator.
 * @returns The message.
 */
export function getExpectation(validator: Validator): string {
  if (typeof validator.expectation === 'function')
    validator.expectation = validator.expectation();
  return (
    validator.expectation ??
    `match ${validator.name ? `'${validator.name}'` : 'assertion'}`
  );
}
