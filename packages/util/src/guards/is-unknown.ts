// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield.

/**
 * Detects whether `value` is is an `unknown` value (always true).
 * @since 3.0.0
 * @param _value The value to identify.
 * @returns `true` if `value` is `unknown` (always).
 */
export function isUnknown(_value: unknown): _value is unknown {
  return true;
}
