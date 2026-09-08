// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { EqualityComparer } from '../types';
import { contains } from './contains';

/**
 * push value to array only if Unique
 * @param array The array to potentially push to.
 * @param toAdd The value to potentially push.
 * @param equalityComparer The function that determines equality.
 * @returns Whether the value was added.
 */
export function pushIfUnique<T>(
  array: T[],
  toAdd: T,
  equalityComparer?: EqualityComparer<T>
): boolean {
  if (contains(array, toAdd, equalityComparer)) {
    return false;
  } else {
    array.push(toAdd);
    return true;
  }
}
