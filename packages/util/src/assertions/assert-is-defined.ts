// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { AssertionError } from '@openinf/assert';

/**
 * Asserts that `val` is neither `undefined` nor `null`.
 * @param val The value to assert is defined.
 * @throws { AssertionError } if `val` is `undefined` or `null`.
 */
export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new AssertionError(
      `Expected 'val' to be defined, but received ${String(val)}`
    );
  }
}
