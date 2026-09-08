// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _isUnsafeKey } from '../_internal/_is-unsafe-key';
import { hasOwn } from '../guards/has-own';
import { isObjectLike } from '../guards/is-object-like';

interface TargetSourceDepth {
  t: Record<string, unknown>;
  s: Record<string, unknown>;
  d: number;
}

/**
 * Deep merges source into target.
 * @param target The object to merge properties into.
 * @param source The object to merge properties from.
 * @param depth The maximum merge depth. If exceeded, `Object.assign` is used
 * instead.
 * @returns The modified `target` object.
 * @throws {Error} If source contains a circular reference.
 * Note: Only nested objects are deep-merged, primitives and arrays are not.
 */
export function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
  depth = 10
): Record<string, unknown> {
  // Keep track of seen objects to detect recursive references. A Set, not an
  // array: this is consulted once per node, so a linear scan made merging an
  // object with n nested objects quadratic.
  const seen = new Set<Record<string, unknown>>();

  // Iterated rather than drained with `shift()`, which is O(n) on V8 because
  // it reindexes the array, and so was the other half of the quadratic
  // behavior. An array iterator rechecks `length` on each step, so entries
  // pushed below are still visited and the traversal stays breadth-first.
  const queue: TargetSourceDepth[] = [{ t: target, s: source, d: 0 }];

  // BFS to ensure objects don't have recursive references at shallower depths.
  for (const { t, s, d } of queue) {
    if (seen.has(s)) {
      throw new Error('Source object has a circular reference.');
    }
    seen.add(s);
    if (t === s) {
      continue;
    }
    if (d > depth) {
      Object.assign(t, s);
      continue;
    }
    Object.keys(s).forEach((key) => {
      // Skipped silently: writing these would reach the target's prototype.
      if (_isUnsafeKey(key)) {
        return;
      }
      const newValue = s[key];
      // Perform a deep merge IFF both target and source have the same key
      // whose corresponding values are objects.
      if (hasOwn(t, key)) {
        const oldValue = t[key];
        if (isObjectLike(newValue) && isObjectLike(oldValue)) {
          queue.push({
            t: oldValue,
            s: newValue,
            d: d + 1,
          });
          return;
        }
      }
      t[key] = newValue;
    });
  }
  return target;
}
