// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Property names that must never be written from attacker-influenced data.
 *
 * Assigning `__proto__` on a plain object replaces its prototype, and reading
 * it during a recursive merge resolves to the shared `Object.prototype`, which
 * would then be used as the merge target. `constructor` reaches the same place
 * via `constructor.prototype`, and `prototype` does when the target is a
 * function.
 */
const UNSAFE_KEYS: ReadonlySet<string> = new Set([
  '__proto__',
  'constructor',
  'prototype',
]);

/**
 * Detects whether writing `key` could reach an object's prototype.
 *
 * Callers that copy caller-supplied keys onto a target must skip these, or a
 * payload such as `{"__proto__":{"isAdmin":true}}` -- which `JSON.parse`
 * produces as a genuine own property -- silently mutates every object in the
 * realm.
 * @param key The property name about to be written.
 * @returns `true` if the key must be skipped; else, `false`.
 */
export function _isUnsafeKey(key: PropertyKey): boolean {
  return typeof key === 'string' && UNSAFE_KEYS.has(key);
}
