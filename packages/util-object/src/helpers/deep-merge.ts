// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _isUnsafeKey } from '../_internal/_is-unsafe-key';
import { hasOwn } from '../guards/has-own';
import { isObjectLike } from '../guards/is-object-like';

interface TargetSourceDepth {
  t: Record<string, unknown>;
  s: Record<string, unknown>;
  d: number;
  p?: SourcePath;
}

interface SourcePath {
  source: Record<string, unknown>;
  parent: SourcePath | undefined;
}

function sourcePathIncludes(
  path: SourcePath | undefined,
  source: Record<string, unknown>
): boolean {
  for (let current = path; current; current = current.parent) {
    if (current.source === source) {
      return true;
    }
  }
  return false;
}

/**
 * Deep merges source into target.
 * @param target The object to merge properties into.
 * @param source The object to merge properties from.
 * @param depth The maximum merge depth. If exceeded, properties are assigned
 * without recursively merging them.
 * @returns The modified `target` object.
 * @throws {Error} If source contains a circular reference.
 * Note: Only nested objects are deep-merged, primitives and arrays are not.
 */
export function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
  depth = 10
): Record<string, unknown> {
  // Iterated rather than drained with `shift()`, which is O(n) on V8 because
  // it reindexes the array, and so was the other half of the quadratic
  // behavior. An array iterator rechecks `length` on each step, so entries
  // pushed below are still visited and the traversal stays breadth-first.
  const queue: TargetSourceDepth[] = [{ t: target, s: source, d: 0 }];

  // BFS to ensure objects don't have recursive references at shallower depths.
  for (const { t, s, d, p } of queue) {
    if (sourcePathIncludes(p, s)) {
      throw new Error('Source object has a circular reference.');
    }
    const path: SourcePath = { source: s, parent: p };
    if (t === s) {
      continue;
    }
    if (d > depth) {
      for (const key of Object.keys(s)) {
        if (!_isUnsafeKey(key)) {
          t[key] = s[key];
        }
      }
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
            p: path,
          });
          return;
        }
      }
      t[key] = newValue;
    });
  }
  return target;
}
