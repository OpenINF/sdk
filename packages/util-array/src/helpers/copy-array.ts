// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _copyDeep } from '../_internal/_copy-deep';

/**
 * Recursively copies the elements of an array, deep-copying any nested
 * arrays and plain objects encountered along the way. Non-plain objects
 * (e.g. class instances, `Date`, `Map`) are copied by reference.
 *
 * A cycle is preserved rather than followed, and an object reached by more
 * than one path is copied once, so the copy has the shape of the original.
 * @category Indexed Collections
 * @param array The array to copy.
 * @param inherited Whether to also copy a plain object's inherited
 * enumerable properties, not just its own.
 * @returns A new array with the same (deep-copied) elements as `array`.
 */
export function copyArray<T>(array: readonly T[], inherited = false): T[] {
  return _copyDeep(array, inherited, new WeakMap<object, unknown>()) as T[];
}
