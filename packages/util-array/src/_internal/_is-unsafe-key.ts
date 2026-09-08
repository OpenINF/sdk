// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Property names that must never be written from attacker-influenced data.
 *
 * Deliberately duplicated from `@openinf/util-object`'s copy of the same
 * check: `util-object` depends on this package, so importing it here would
 * form a cycle. Three lines of duplication is the cheaper trade, but the two
 * must stay in agreement.
 */
const UNSAFE_KEYS: ReadonlySet<string> = new Set([
  '__proto__',
  'constructor',
  'prototype',
]);

/**
 * Detects whether writing `key` could reach an object's prototype.
 * @param key The property name about to be written.
 * @returns `true` if the key must be skipped; else, `false`.
 */
export function _isUnsafeKey(key: PropertyKey): boolean {
  return typeof key === 'string' && UNSAFE_KEYS.has(key);
}
