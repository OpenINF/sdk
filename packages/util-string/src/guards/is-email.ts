// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield.

import type { Guard, Tagged } from '@openinf/util-core';

/**
 * A string accepted by {@link isEmail}'s email syntax check.
 * @category Text Processing
 */
export type Email = Tagged<string, '__Email__'>;

/**
 * Detects whether `value` has a nonempty local part and a dotted domain,
 * without whitespace or additional `@` characters.
 *
 * This is a basic syntax check, not a check that the address exists. Its
 * scans stay linear even for long invalid input.
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
export function isEmail(value: unknown): value is Email {
  if (typeof value !== 'string' || /\s/.test(value)) return false;

  const at = value.indexOf('@');
  if (at < 1 || value.includes('@', at + 1)) return false;

  // Both sides of the domain's dot must contain at least one character.
  // Looking for its first possible position avoids repeatedly backtracking
  // over the same suffix when an invalid domain contains many dots.
  const dot = value.indexOf('.', at + 2);
  return dot !== -1 && dot < value.length - 1;
}
(isEmail as Guard).expectation = 'be an email address';
