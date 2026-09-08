// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _isUnsafeKey } from '../_internal/_is-unsafe-key';
import { hasOwn } from '../guards/has-own';

/**
 * Shallowly clones an object's own enumerable properties.
 * @param object The object to clone.
 * @returns The clone.
 */
export function clone<T extends object>(object: T): T {
  const result: Record<string, unknown> = {};
  for (const id in object) {
    if (hasOwn(object, id) && !_isUnsafeKey(id)) {
      result[id] = object[id];
    }
  }
  return result as T;
}
