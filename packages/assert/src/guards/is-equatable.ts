// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isNonNullish } from '@openinf/util-core';
import type { Equatable, Guard } from '@openinf/util-core';

/**
 * Detects whether `value` implements the {@link @openinf/util!Equatable} interface, i.e.
 * has an `equals` method.
 * @param value The value to identify.
 * @returns `true` if `value` is Equatable; else, `false`.
 * @example
 * ```ts
 * isEquatable({ equals: () => true }); // ↪ true
 *
 * isEquatable({}); // ↪ false
 * ```
 */
export function isEquatable(value: unknown): value is Equatable {
  return (
    isNonNullish(value) && typeof (value as Equatable).equals === 'function'
  );
}
(isEquatable as Guard).expectation = 'be Equatable';
