// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isNonNullish } from '@openinf/util-core';
import type { Comparable, Guard } from '@openinf/util-core';

/**
 * Detects whether `value` implements the {@link @openinf/util!Comparable} interface, i.e.
 * has a `compareTo` method.
 * @param value The value to identify.
 * @returns `true` if `value` is Comparable; else, `false`.
 * @example
 * ```ts
 * isComparable({ compareTo: () => 0 }); // ↪ true
 *
 * isComparable({}); // ↪ false
 * ```
 */
export function isComparable(value: unknown): value is Comparable {
  return (
    isNonNullish(value) && typeof (value as Comparable).compareTo === 'function'
  );
}
(isComparable as Guard).expectation = 'be Comparable';
