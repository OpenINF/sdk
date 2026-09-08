// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield.

import type { Guard } from '@openinf/util-core';

/**
 * Creates a guard that tests if a string value does not contain `substring`.
 * @param substring The substring to search for.
 * @returns The guard.
 * @example ```ts
 * const isStringNotContainingFoo = isStringNotContaining('foo');
 *
 * isStringNotContainingFoo('barbaz'); // ↪ true
 *
 * isStringNotContainingFoo('foobar'); // ↪ false
 * ```
 */
export function isStringNotContaining(substring: string): Guard<string> {
  const guard: Guard<string> = (value: unknown): value is string =>
    typeof value === 'string' && !value.includes(substring);
  guard.expectation = () => `not contain '${substring}'`;
  return guard;
}
