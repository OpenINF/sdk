// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { hasOwn } from '../guards/has-own';

/**
 * Gets `map[key]` if `key` is an own property of `map`.
 * @category Fundamental Objects
 * @param map A map-like.
 * @param key A property key.
 * @returns `map[key]` if `key` is an own property of `map` (is not
 * inherited); otherwise, `undefined`.
 */
export function ownProperty<P extends PropertyKey, T>(
  map: Record<P, T>,
  key: P
): T | undefined {
  return hasOwn(map, key) ? map[key] : undefined;
}
