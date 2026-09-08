// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield.

import type { Guard } from '@openinf/util-core';

/**
 * Creates a guard that tests if a string value contains `substring`.
 * @param substring The substring to search for.
 * @returns The guard.
 * @example ```ts
 * const isStringContainingFoo = isStringContaining('foo');
 *
 * isStringContainingFoo('foobar'); // ↪ true
 *
 * isStringContainingFoo('barbaz'); // ↪ false
 * ```
 */
export function isStringContaining(substring: string): Guard<string> {
  const guard: Guard<string> = (value: unknown): value is string =>
    typeof value === 'string' && value.includes(substring);
  guard.expectation = () => `contain '${substring}'`;
  return guard;
}
