// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { hasOwn } from '../guards/has-own';

/**
 * Gets the map[key] iff the key is the map's own property
 * @param map A map-like.
 * @param key A property key.
 * @returns map[key] iff the key is the map's own property (is not inherited);
 * otherwise, returns `undefined`.
 */
export function ownProperty<P extends PropertyKey, T>(
  map: Record<P, T>,
  key: P
): T | undefined {
  return hasOwn(map, key) ? map[key] : undefined;
}
