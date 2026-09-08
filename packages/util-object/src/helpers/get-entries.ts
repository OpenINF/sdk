// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeScript Compiler

import type { MapLike } from '../types';
import { getOwnKeys } from './get-own-keys';

/**
 * Gets the key/values of the enumerable properties of an object.
 * @param obj Object that contains the properties and methods. This can be an
 * object that you created or an existing Document Object Model (DOM) object.
 * @returns An array of key/values of the enumerable properties of an object.
 */
export function getEntries<T>(obj: MapLike<T>): [string, T][] {
  // TODO: Assert not falsy.
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
