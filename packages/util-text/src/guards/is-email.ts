// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield.

import type { Guard } from '@openinf/util-core';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Detects whether `value` is a string containing a syntactically valid email
 * address.
 * @since 3.0.0
 * @category Text Processing
 * @param value The value to identify.
 * @returns `true` if `value` is an email address; else, `false`.
 * @example
 * ```ts
 * isEmail('foo@example.com'); // ↪ true
 *
 * isEmail('foo@'); // ↪ false
 * ```
 */
export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && emailPattern.test(value);
}
(isEmail as Guard).expectation = 'be an email address';
