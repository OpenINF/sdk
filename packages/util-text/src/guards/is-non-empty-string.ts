// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield.

import type { Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is a string of length greater than `0`.
 * @since 3.0.0
 * @category Text Processing
 * @param value The value to identify.
 * @returns `true` if `value` is a non-empty string; else, `false`.
 * @example
 * ```ts
 * isNonEmptyString('foo'); // ↪ true
 *
 * isNonEmptyString(''); // ↪ false
 * ```
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}
(isNonEmptyString as Guard).expectation = 'be a non-empty string';
