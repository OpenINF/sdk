// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isArray } from '@openinf/util-core';

/**
 * Wraps a value that is not an array in one.
 * @category Indexed Collections
 * @param value The value to potentially convert into an array.
 * @returns `value` itself if it is an array; else, `[value]`.
 */
export function toArray(value: unknown): unknown[] {
  return isArray(value) ? value : [value];
}
