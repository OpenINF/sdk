// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _isUnsafeKey } from '../_internal/_is-unsafe-key';

function isPlainObject(value: unknown): value is Record<PropertyKey, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const proto: unknown = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function keysOf(value: Record<string, unknown>, inherited: boolean): string[] {
  if (!inherited) {
    return Object.keys(value);
  }
  const keys: string[] = [];
  for (const key in value) {
    keys.push(key);
  }
  return keys;
}

function deepCopy<T>(value: T, inherited: boolean): T {
  if (Array.isArray(value)) {
    return value.map((item: unknown) =>
      deepCopy(item, inherited)
    ) as unknown as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const copy: Record<PropertyKey, unknown> = {};
  for (const key of keysOf(value, inherited)) {
    // Skipped silently: `copy['__proto__'] = ...` would replace the new
    // object's prototype rather than adding a property to it.
    if (_isUnsafeKey(key)) {
      continue;
    }
    copy[key] = deepCopy(value[key], inherited);
  }

  return copy as T;
}

/**
 * Recursively copies the elements of an array, deep-copying any nested
 * arrays and plain objects encountered along the way. Non-plain objects
 * (e.g. class instances, `Date`, `Map`) are copied by reference.
 * @param array The array to copy.
 * @param inherited Whether to also copy a plain object's inherited
 * enumerable properties, not just its own.
 * @returns A new array with the same (deep-copied) elements as `array`.
 */
export function copyArray<T>(array: readonly T[], inherited = false): T[] {
  return array.map((item) => deepCopy(item, inherited));
}
