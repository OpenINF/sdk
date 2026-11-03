// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Dojo Framework.

import { _copyDeep } from '@openinf/util-array';

import { hasOwn } from '../guards/has-own';
import { isObjectCoercible } from '../guards/is-object-coercible';
import { isPlainObject } from '../guards/is-plain-object';
import { _isUnsafeKey } from './_is-unsafe-key';

interface MixinArgs<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
> {
  deep: boolean;
  inherited: boolean;
  sources: (U | null | undefined)[];
  target: T;
  copies?: WeakMap<object, unknown>;
  merged?: WeakMap<object, WeakSet<object>>;
  activeCopies?: Map<object, unknown>;
  settled?: WeakMap<object, WeakMap<object, number>>;
  progress?: { changes: number; accessorReads: number };
}

/**
 * Whether reading `object[key]` runs a getter, wherever along the prototype
 * chain the property is found. A getter can answer differently each time it
 * is read, so a merge that read one cannot be taken as settled.
 * @param object The object about to be read.
 * @param key The key about to be read.
 * @returns `true` if the property is an accessor.
 */
function isAccessor(object: object, key: string): boolean {
  for (
    let holder: object | null = object;
    holder !== null;
    holder = Object.getPrototypeOf(holder) as object | null
  ) {
    const descriptor = Object.getOwnPropertyDescriptor(holder, key);
    if (descriptor !== undefined) return !('value' in descriptor);
  }
  return false;
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
 * Copies properties from one or more source objects onto a target object.
 * @private
 * @param kwArgs The mixin arguments.
 * @returns The mixed-in target.
 */
export function _mixin<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
>(kwArgs: MixinArgs<T, U>): T & U {
  const isDeep = kwArgs.deep;
  const isInherited = kwArgs.inherited;
  const target: Record<string, unknown> = kwArgs.target;
  // What each source came back as, so a source reached twice comes back as one
  // object rather than two. Shared with `_copyDeep` so that an object reached
  // through an array and through a property is still one object.
  const copies = kwArgs.copies ?? new WeakMap<object, unknown>();
  // Which targets each source is actively being merged into. A source that
  // reaches itself would otherwise recurse forever whenever the target holds
  // an object of its own at the same path.
  const merged = kwArgs.merged ?? new WeakMap<object, WeakSet<object>>();
  const activeCopies = kwArgs.activeCopies ?? new Map<object, unknown>();
  // How many assignments so far have changed a target and getters have been
  // run, and, for each source merged into an existing target, what that
  // count was when the merge finished. A merge rerun with nothing changed and
  // no getter run since it finished would make the same assignments to the
  // same values, so it is skipped. A merge that ran a getter anywhere along
  // the way, on the source or the target, is never taken as settled, since
  // the getter could answer differently the next time. Without this,
  // a source and a target that both reach one object along several paths are
  // merged again along every one of them, and a graph with a few dozen such
  // levels takes longer than anyone would wait.
  const settled =
    kwArgs.settled ?? new WeakMap<object, WeakMap<object, number>>();
  const progress = kwArgs.progress ?? { changes: 0, accessorReads: 0 };

  for (const source of kwArgs.sources) {
    if (source === null || source === undefined) {
      continue;
    }

    let mergedInto = merged.get(source);
    if (mergedInto === undefined) {
      mergedInto = new WeakSet();
      merged.set(source, mergedInto);
    }
    if (mergedInto.has(target)) {
      continue;
    }
    mergedInto.add(target);

    if (!copies.has(source)) copies.set(source, target);
    const wasActive = activeCopies.has(source);
    const previousActive = activeCopies.get(source);
    activeCopies.set(source, target);
    const accessorReadsBefore = progress.accessorReads;

    for (const key in source) {
      // Skipped silently: reading `target[key]` below would otherwise resolve
      // `__proto__` through the prototype chain and merge into the shared
      // `Object.prototype` itself.
      if (_isUnsafeKey(key)) {
        continue;
      }
      if (isInherited || hasOwn(source, key)) {
        if (isAccessor(source, key)) progress.accessorReads += 1;
        let value: unknown = source[key];

        if (isDeep) {
          if (Array.isArray(value)) {
            // An array replaces what the target holds rather than merging into
            // it, so whatever was recorded for this one can always be reused;
            // `_copyDeep` reads the map itself.
            value = _copyDeep(value, isInherited, copies);
          } else if (isPlainObject(value)) {
            // Only a plain object is copied property by property. Anything
            // else (a function, a `Date`, a `Map`, a class instance) keeps
            // what its own properties cannot carry, so it is assigned by
            // reference, as `_copyDeep` does inside an array.
            const sourceObject = value as Record<string, unknown>;
            let targetValue: unknown;
            if (hasOwn(target, key)) {
              if (isAccessor(target, key)) progress.accessorReads += 1;
              targetValue = target[key];
            }
            if (
              isObjectCoercible(targetValue) &&
              settled.get(sourceObject)?.get(targetValue as object) ===
                progress.changes + progress.accessorReads
            ) {
              value = targetValue;
            } else if (isObjectCoercible(targetValue)) {
              const existingTarget = targetValue as Record<string, unknown>;
              // What the target already holds here is merged into, whatever
              // this source came back as somewhere else: handing back that
              // other object would drop every property this one already has.
              //
              // For as long as that merge runs, this source stands for the
              // object it is being merged into, so a cycle within it closes on
              // that object rather than on the one another path produced.
              // A different existing destination needs its own copy cache:
              // cached arrays can otherwise close cycles onto the first one.
              // Keep the active ancestors so back-references still close.
              const branchCopies =
                copies.has(sourceObject) &&
                copies.get(sourceObject) !== existingTarget
                  ? new WeakMap<object, unknown>(activeCopies)
                  : copies;
              branchCopies.set(sourceObject, existingTarget);
              value = _mixin<Record<string, unknown>, Record<string, unknown>>({
                deep: true,
                inherited: isInherited,
                sources: [sourceObject],
                target: existingTarget,
                copies: branchCopies,
                merged,
                activeCopies,
                settled,
                progress,
              });
            } else if (copies.has(sourceObject)) {
              // Nothing here to keep, so the source's own shape is kept
              // instead: a second path to one object arrives at one object,
              // and a cycle closes on whatever stands in for the source.
              value = copies.get(sourceObject);
            } else {
              const nestedTarget: Record<string, unknown> = {};
              copies.set(sourceObject, nestedTarget);
              value = _mixin<Record<string, unknown>, Record<string, unknown>>({
                deep: true,
                inherited: isInherited,
                sources: [sourceObject],
                target: nestedTarget,
                copies,
                merged,
                activeCopies,
                settled,
                progress,
              });
            }
          }
        }
        if (!holdsAlready(target, key, value)) progress.changes += 1;
        target[key] = value;
      }
    }
    let settledInto = settled.get(source);
    if (settledInto === undefined) {
      settledInto = new WeakMap();
      settled.set(source, settledInto);
    }
    if (progress.accessorReads === accessorReadsBefore) {
      settledInto.set(target, progress.changes + progress.accessorReads);
    } else {
      settledInto.delete(target);
    }
    // Only active source/target pairs break cycles. A later source argument
    // must run again so that its values regain their normal precedence.
    mergedInto.delete(target);
    if (wasActive) activeCopies.set(source, previousActive);
    else activeCopies.delete(source);
  }

  return target as T & U;
}
