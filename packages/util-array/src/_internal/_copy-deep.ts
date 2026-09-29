// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _isUnsafeKey } from './_is-unsafe-key';

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

/**
 * Recursively copies an array or plain object, answering anything already in
 * `copies` with what was recorded for it. A graph that reaches itself
 * therefore terminates, and two paths to one object stay two paths to one
 * object.
 *
 * Non-plain objects (a class instance, a `Date`, a `Map`) are copied by
 * reference, so they are never recorded.
 * @private
 * @param value The value to copy.
 * @param inherited Whether to also copy a plain object's inherited enumerable
 * properties, not just its own.
 * @param copies What each source reached so far came back as. A caller
 * building the rest of a graph passes its own map, so both agree on which
 * values are the same value.
 * @returns The copy, or `value` itself when it is neither an array nor a plain
 * object.
 */
export function _copyDeep<T>(
  value: T,
  inherited: boolean,
  copies: WeakMap<object, unknown>
): T {
  if (Array.isArray(value)) {
    if (copies.has(value)) return copies.get(value) as T;

    const copy: unknown[] = [];
    copy.length = value.length;
    copies.set(value, copy);
    for (let index = 0; index < value.length; index += 1) {
      // Array.prototype.map, which this replaces, visits inherited indexed
      // properties but preserves holes with no property anywhere in the chain.
      if (index in value) {
        copy[index] = _copyDeep(value[index], inherited, copies);
      }
    }
    return copy as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  if (copies.has(value)) return copies.get(value) as T;

  const copy: Record<PropertyKey, unknown> = {};
  copies.set(value, copy);
  for (const key of keysOf(value, inherited)) {
    // Skipped silently: `copy['__proto__'] = ...` would replace the new
    // object's prototype rather than adding a property to it.
    if (_isUnsafeKey(key)) {
      continue;
    }
    copy[key] = _copyDeep(value[key], inherited, copies);
  }

  return copy as T;
}
