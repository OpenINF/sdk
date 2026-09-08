// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield.

/**
 * Type guard that detects whether `value` is an `any` value (always true).
 * @since 3.0.0
 * @param _value The value to identify.
 * @returns `true` if `value` is `any` (always).
 */
export function isAny(_value: unknown): _value is any {
  return true;
}
