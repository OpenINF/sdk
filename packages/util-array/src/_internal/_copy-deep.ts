// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _isPlainObject } from '@openinf/util-core';

import { _isUnsafeKey } from './_is-unsafe-key';

/**
 * Gives `copy` an own data property `key` holding `value`. Defining it, rather
 * than assigning it, never consults the prototype chain, so an inherited setter
 * or read-only property cannot intercept or refuse the write.
 * @param copy The fresh copy being built.
 * @param key The property to define.
 * @param value What the property holds.
 */
function defineOwn(copy: object, key: PropertyKey, value: unknown): void {
  Object.defineProperty(copy, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

/**
 * Above this length an array is no longer walked index by index. Below it the
 * walk costs no more than listing the indices would.
 */
const INDEX_WALK_MAX = 0x10000;

/**
 * Every index below `length` that `array` or anything on its prototype chain
 * holds a property at, in ascending order. These are the only indices `in`
 * can answer `true` for, so a sparse array costs what it holds rather than
 * what its `length` claims.
 * @param array The array to read.
 * @param length The array's length.
 * @returns The candidate indices, each still to be confirmed with `in`.
 */
function heldIndices(array: unknown[], length: number): number[] {
  const indices = new Set<number>();
  for (
    let holder: object | null = array;
    holder !== null;
    holder = Object.getPrototypeOf(holder) as object | null
  ) {
    for (const key of Object.getOwnPropertyNames(holder)) {
      const index = Number(key);
      if (Number.isInteger(index) && index >= 0 && index < length) {
        if (String(index) === key) indices.add(index);
      }
    }
  }
  return [...indices].sort((a, b) => a - b);
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
    // Array.prototype.map, which this replaces, visits inherited indexed
    // properties but preserves holes with no property anywhere in the chain.
    // A long array is read through the indices it holds instead: walking
    // every index of `new Array(2 ** 32 - 1)` to find none present would take
    // minutes for an empty copy.
    const copyIndex = (index: number): boolean => {
      if (!(index in value)) return false;
      defineOwn(copy, index, _copyDeep(value[index], inherited, copies));
      return true;
    };
    if (value.length <= INDEX_WALK_MAX) {
      for (let index = 0; index < value.length; index += 1) copyIndex(index);
    } else {
      // Copying an element can run a getter, and a getter can add indices
      // the first listing never saw, so the listing is taken again until it
      // holds nothing new. That is one more listing for an ordinary array.
      const copied = new Set<number>();
      for (;;) {
        const pending = heldIndices(value, value.length).filter(
          (index) => !copied.has(index)
        );
        if (pending.length === 0) break;
        // A pass that copies nothing ran no getter, so listing again would
        // find the same indices: a proxy can list an index its `has` trap
        // denies, and would otherwise keep this loop going forever.
        let progressed = false;
        for (const index of pending) {
          // Marked only once read: an index a getter removed before its turn
          // is listed again, and copied, if another getter puts it back.
          if (index < value.length && copyIndex(index)) {
            copied.add(index);
            progressed = true;
          }
        }
        if (!progressed) break;
      }
    }
    return copy as T;
  }

  if (!_isPlainObject(value)) {
    return value;
  }

  if (copies.has(value)) return copies.get(value) as T;

  const copy: Record<PropertyKey, unknown> = {};
  copies.set(value, copy);
  for (const key of keysOf(value, inherited)) {
    // Skipped silently, as every copy and merge in the SDK does, so that a
    // copy handed on to code that assigns its keys cannot carry them along.
    if (_isUnsafeKey(key)) {
      continue;
    }
    defineOwn(copy, key, _copyDeep(value[key], inherited, copies));
  }

  return copy as T;
}
