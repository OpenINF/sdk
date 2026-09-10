// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

/**
 * Creates a guard that tests if a string value matches `pattern`.
 * @param pattern The pattern to test against.
 * @returns The guard.
 * @example
 * ```ts
 * const isMatchFoo = isMatch(/^foo/);
 *
 * isMatchFoo('foobar'); // ↪ true
 *
 * isMatchFoo('barfoo'); // ↪ false
 * ```
 */
export function isMatch(pattern: RegExp): Guard<string> {
  const guard: Guard<string> = (value: unknown): value is string =>
    typeof value === 'string' && pattern.test(value);
  guard.expectation = () => `match ${pattern.toString()}`;
  return guard;
}
