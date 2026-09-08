// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isArray } from '@openinf/util-core';

/**
 * Converts a non-array to an array.
 * @param value The value to potentially convert into an array.
 * @returns If the value is already an array, returns itself untouched.
 */
export function toArray(value: unknown): unknown[] {
  return isArray(value) ? value : [value];
}
