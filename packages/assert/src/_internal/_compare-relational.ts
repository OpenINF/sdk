// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { ComparisonResult } from '@openinf/util-core';

/**
 * Compares two primitive values without the coercion of JavaScript's
 * relational operators.
 * @internal
 * @param value The candidate value.
 * @param expected The value to compare it with.
 * @returns Their comparison result, or `undefined` when they cannot be
 * compared without coercion.
 */
export function _compareRelational(
  value: unknown,
  expected: unknown
): ComparisonResult {
  if (typeof value !== typeof expected) {
    return undefined;
  }

  if (typeof value === 'number' && typeof expected === 'number') {
    if (Number.isNaN(value) || Number.isNaN(expected)) return undefined;
    return value < expected ? -1 : value > expected ? 1 : 0;
  }

  if (typeof value === 'bigint' && typeof expected === 'bigint') {
    return value < expected ? -1 : value > expected ? 1 : 0;
  }

  if (typeof value === 'string' && typeof expected === 'string') {
    return value < expected ? -1 : value > expected ? 1 : 0;
  }

  return undefined;
}
