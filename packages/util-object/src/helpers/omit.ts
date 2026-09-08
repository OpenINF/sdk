// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Creates an object with the given properties removed.
 * @param obj An object to remove properties from.
 * @param props A list of properties to remove from the Object.
 * @returns An object with the given properties removed.
 */
import { _isUnsafeKey } from '../_internal/_is-unsafe-key';

export function omit<T>(
  obj: Record<string, T>,
  props: string[]
): Record<string, T> {
  // Built once. Scanning `props` per key made this O(keys x props).
  const omitted = new Set(props);
  return Object.keys(obj).reduce((acc: Record<string, T>, key) => {
    if (!omitted.has(key) && !_isUnsafeKey(key)) {
      // key comes from Object.keys(obj), so obj[key] is guaranteed present.
      acc[key] = obj[key]!;
    }
    return acc;
  }, {});
}
