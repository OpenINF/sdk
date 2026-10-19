// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeScript

import type { EqualityComparer } from '../types';
import { contains } from './contains';

/**
 * Pushes `toAdd` onto `array` unless an equal element is already there.
 * @category Indexed Collections
 * @param array The array to potentially push to.
 * @param toAdd The value to potentially push.
 * @param equalityComparer Decides whether two elements are equal. Defaults
 * to strict equality.
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
