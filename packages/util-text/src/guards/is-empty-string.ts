// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield.

import type { Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is a string of length `0`.
 * @since 3.0.0
 * @category Text Processing
 * @param value The value to identify.
 * @returns `true` if `value` is an empty string; else, `false`.
 * @example ```ts
 * isEmptyString(''); // ↪ true
 *
 * isEmptyString('foo'); // ↪ false
 * ```
 */
export function isEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length === 0;
}
(isEmptyString as Guard).expectation = 'be an empty string';
