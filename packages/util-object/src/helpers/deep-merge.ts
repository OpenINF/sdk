// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isObjectLike } from '@openinf/util-core';

import { _isUnsafeKey } from '../_internal/_is-unsafe-key';
import { hasOwn } from '../guards/has-own';
import { isPlainObject } from '../guards/is-plain-object';

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

/**
 * Whether assigning `value` to `target[key]` would leave `target` as it is:
 * the key is already an own data property holding that very value. Read from
 * the descriptor so that a getter on the target is not run to find out.
 * @param target The object about to be assigned to.
 * @param key The key about to be assigned.
 * @param value The value about to be assigned.
 * @returns `true` if the assignment would change nothing.
 */
function holdsAlready(
  target: Record<string, unknown>,
  key: string,
  value: unknown
): boolean {
  const descriptor = Object.getOwnPropertyDescriptor(target, key);
  return (
    descriptor !== undefined &&
    'value' in descriptor &&
    Object.is(descriptor.value, value)
  );
}

/**
 * Whether reading `object[key]` runs a getter. Only own properties are read
 * here: the source's own enumerable keys and keys the target holds itself.
 * @param object The object about to be read.
 * @param key The key about to be read.
 * @returns `true` if the property is an accessor.
 */
function isAccessor(object: object, key: string): boolean {
  const descriptor = Object.getOwnPropertyDescriptor(object, key);
  return descriptor !== undefined && !('value' in descriptor);
}

/**
 * Builds a check of whether merging an object from a given depth reads only
 * data properties: no getter on it, nor on any object below it that the
 * merge could go on to read before reaching `depth`. Only then does reading
 * it again give the same values. Each step down is a level deeper and the
 * check stops past `depth`, so a cycle ends it like any other path, and
 * answers are remembered per object and level, so each object costs one
 * look per level at most until the merge moves on.
 * @param depth The merge's depth limit.
 * @param keysOf The keys the merge reads from an object on this side.
 * @param descends Whether the merge could go on into a value on this side.
 * @param version A count that moves whenever the merge changes a target or
 * runs a getter, which is when remembered answers stop holding.
 * @returns The check, taking an object and the depth it is merged from.
 */
function steadinessWithin(
  depth: number,
  keysOf: (object: object) => string[],
  descends: (value: unknown) => boolean,
  version: () => number
): (object: Record<string, unknown>, level: number) => boolean {
  let known = new Map<number, WeakMap<object, boolean>>();
  let knownAt = version();

  const isSteady = (
    object: Record<string, unknown>,
    level: number
  ): boolean => {
    let atLevel = known.get(level);
    if (atLevel === undefined) {
      atLevel = new WeakMap();
      known.set(level, atLevel);
    }
    const answer = atLevel.get(object);
    if (answer !== undefined) return answer;

    let steadyHere = true;
    for (const key of keysOf(object)) {
      const descriptor = Object.getOwnPropertyDescriptor(object, key);
      if (descriptor === undefined || !('value' in descriptor)) {
        steadyHere = false;
        break;
      }
      if (
        level <= depth &&
        descends(descriptor.value) &&
        !isSteady(descriptor.value as Record<string, unknown>, level + 1)
      ) {
        steadyHere = false;
        break;
      }
    }

    atLevel.set(object, steadyHere);
    return steadyHere;
  };

  return (object, level) => {
    const now = version();
    if (now !== knownAt) {
      known = new Map();
      knownAt = now;
    }
    try {
      return isSteady(object, level);
    } catch {
      // Too deep to check, or a proxy that refused to be read: merged again,
      // as it would have been without the check.
      return false;
    }
  };
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
 *
 * Only nested plain objects are merged. Anything else on the source (a
 * primitive, an array, a function, a `Date`, a `Map`, a class instance)
 * replaces whatever the target holds at that key, and is assigned as it stands
 * rather than copied, so the target and the source share it afterwards. A
 * plain object is shared the same way wherever the target holds nothing at
 * that key to merge it into, such as a key it lacks. The keys `__proto__`,
 * `constructor` and `prototype` are skipped, since writing them could reach a
 * prototype, and symbol keys are not copied.
 * @category Fundamental Objects
 * @param target The object to merge properties into.
 * @param source The object to merge properties from.
 * @param depth The maximum merge depth. If exceeded, properties are assigned
 * without recursively merging them.
 * @returns The modified `target` object.
 * @throws {Error} If the merge, descending into plain objects the target also
 * has, reaches a source object it is already inside. This is not a general
 * cycle check: a cycle the merge does not descend into is assigned as it
 * stands, and one the target and source already share is left alone.
 */
export function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
  depth = 10
): Record<string, unknown> {
  // Iterated rather than drained with `shift()`, which is O(n) on V8 because
  // it reindexes the array, and would make the traversal quadratic. An
  // array iterator rechecks `length` on each step, so entries
  // pushed below are still visited and the traversal stays breadth-first.
  const root: TargetSourceDepth = { t: target, s: source, d: 0 };
  const queue: TargetSourceDepth[] = [root];
  // How many assignments so far have changed a target and getters have been
  // run, and, for each pair of target and source at each depth, what that
  // count was when the pair was last merged there. A pair reached again at
  // the same depth with nothing changed and no getter run since would make
  // the same assignments to the same values, and queue the same work, so it
  // is skipped -- provided its own merge ran no getter, and no getter on
  // either side, at or below the pair, could answer differently the second
  // time. Without this, a source and a target that both reach one object
  // along several paths queue it along every one of them, and a few such
  // levels within the default depth multiply into more work than anyone
  // would wait for.
  let changes = 0;
  let getterRuns = 0;
  const settled = new Map<number, WeakMap<object, WeakMap<object, number>>>();
  const version = (): number => changes + getterRuns;
  const steadySource = steadinessWithin(
    depth,
    Object.keys,
    isPlainObject,
    version
  );
  const steadyTarget = steadinessWithin(
    depth,
    Object.getOwnPropertyNames,
    (value) => !Array.isArray(value) && isObjectLike(value),
    version
  );
  const read = (object: Record<string, unknown>, key: string): unknown => {
    if (isAccessor(object, key)) getterRuns += 1;
    return object[key];
  };
  // A pair queued right after a different one changes what the queue will
  // do, even though no target has changed yet: a pair skipped later as
  // settled would otherwise lose its place after that other pair, and the
  // other pair's values would win where this one's should. Queuing the pair
  // just queued again changes nothing, which keeps shared objects cheap.
  let lastQueued = root;
  const enqueue = (next: TargetSourceDepth): void => {
    if (
      next.t !== lastQueued.t ||
      next.s !== lastQueued.s ||
      next.d !== lastQueued.d
    ) {
      changes += 1;
    }
    lastQueued = next;
    queue.push(next);
  };
  const assign = (
    t: Record<string, unknown>,
    key: string,
    value: unknown
  ): void => {
    if (!holdsAlready(t, key, value)) changes += 1;
    t[key] = value;
  };

  // BFS to ensure objects don't have recursive references at shallower depths.
  for (const { t, s, d, p } of queue) {
    if (sourcePathIncludes(p, s)) {
      throw new Error('Source object has a circular reference.');
    }
    const path: SourcePath = { source: s, parent: p };
    if (t === s) {
      continue;
    }
    // Past the depth limit every pair is assigned over alike.
    const level = Math.min(d, depth + 1);
    let settledByTarget = settled.get(level);
    if (settledByTarget === undefined) {
      settledByTarget = new WeakMap();
      settled.set(level, settledByTarget);
    }
    let settledFor = settledByTarget.get(t);
    if (
      settledFor?.get(s) === changes + getterRuns &&
      steadySource(s, level) &&
      steadyTarget(t, level)
    ) {
      continue;
    }
    if (settledFor === undefined) {
      settledFor = new WeakMap();
      settledByTarget.set(t, settledFor);
    }
    const getterRunsBefore = getterRuns;
    const settle = (): void => {
      if (getterRuns === getterRunsBefore) {
        settledFor.set(s, changes + getterRuns);
      } else {
        settledFor.delete(s);
      }
    };
    if (d > depth) {
      for (const key of Object.keys(s)) {
        if (!_isUnsafeKey(key)) {
          assign(t, key, read(s, key));
        }
      }
      settle();
      continue;
    }
    Object.keys(s).forEach((key) => {
      // Skipped silently: writing these would reach the target's prototype.
      if (_isUnsafeKey(key)) {
        return;
      }
      const newValue = read(s, key);
      // Perform a deep merge IFF both target and source have the same key,
      // the source's value is a plain object and the target's is an object.
      if (hasOwn(t, key)) {
        const oldValue = read(t, key);
        if (
          isPlainObject(newValue) &&
          !Array.isArray(oldValue) &&
          isObjectLike(oldValue)
        ) {
          enqueue({
            t: oldValue,
            s: newValue as Record<string, unknown>,
            d: d + 1,
            p: path,
          });
          return;
        }
      }
      assign(t, key, newValue);
    });
    settle();
  }
  return target;
}
