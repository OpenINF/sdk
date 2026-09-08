// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { strict as assert } from 'node:assert';

import { getClassName } from './get-class-name';

/**
 * Checks the receiver for a keyed collection standard built-in object's
 * internal slots.
 * @private
 * @param value The value to query.
 * @returns `true` if has correct internal slots; else, `false`.
 */
export function tryDetectInternalSlots(value: unknown): boolean {
  assert(getClassName(value), 'value must be a keyed collection');
  // is it a keyed collection class?
  // irrelevant, but prototype must have `.has`.
  // before even attempting to determine whether an object has these slots
  try {
    const globalRecord = globalThis as unknown as Record<
      string,
      { prototype: { has: (value: unknown) => unknown } }
    >;
    // Not provably safe: getClassName(value) may not name an actual global.
    // Relies on the catch below, not on this assertion, for correctness.
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
    globalRecord[getClassName(value)]!.prototype.has.call(value, undefined);
    return true;
  } catch {
    return false;
  }
}
