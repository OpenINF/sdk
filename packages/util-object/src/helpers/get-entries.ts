// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeScript Compiler

import type { MapLike } from '../types';
import { getOwnKeys } from './get-own-keys';

/**
 * Gets the key/value pairs of the own enumerable properties of an object.
 * @category Fundamental Objects
 * @param obj The object to read.
 * @returns An array of `[key, value]` pairs, one per own enumerable property.
 */
export function getEntries<T>(obj: MapLike<T>): [string, T][] {
  const keys = getOwnKeys(obj);
  const result: [string, T][] = Array.from({ length: keys.length });
  for (let i = 0; i < keys.length; i++) {
    // i < keys.length guarantees keys[i] is present.
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
    const key = keys[i]!;
    // key comes from getOwnKeys(obj), so obj[key] is guaranteed present.
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
    result[i] = [key, obj[key]!];
  }
  return result;
}
