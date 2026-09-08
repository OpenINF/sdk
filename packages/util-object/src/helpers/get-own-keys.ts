// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeScript Compiler. Copyright Microsoft. All right reserved.

import { hasOwn } from '../guards/has-own';
import type { MapLike } from '../types';

/**
 * Gets the owned, enumerable property keys of a map-like.
 * @param map A map-like object to query.
 * @returns A list of keys.
 */
export function getOwnKeys<T>(map: MapLike<T>): string[] {
  const keys: string[] = [];

  for (const key in map) {
    if (hasOwn(map, key)) {
      keys.push(key);
    }
  }

  return keys;
}
