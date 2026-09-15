// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield.

import type { Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is an `unknown` value (always true).
 * @since 3.0.0
 * @category Data Types and Values
 * @param _value The value to identify.
 * @returns `true` if `value` is `unknown` (always).
 */
export function isUnknown(_value: unknown): _value is unknown {
  return true;
}
(isUnknown as Guard).expectation = 'be any value';
