// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Dojo Framework.

import { _copyDeep } from '@openinf/util-array';

import { hasOwn } from '../guards/has-own';
import { isObjectCoercible } from '../guards/is-object-coercible';
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
  // Which targets each source has already been merged into. A source that
  // reaches itself would otherwise recurse forever whenever the target holds
  // an object of its own at the same path.
  const merged = kwArgs.merged ?? new WeakMap<object, WeakSet<object>>();

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

    for (const key in source) {
      // Skipped silently: reading `target[key]` below would otherwise resolve
      // `__proto__` through the prototype chain and merge into the shared
      // `Object.prototype` itself.
      if (_isUnsafeKey(key)) {
        continue;
      }
      if (isInherited || hasOwn(source, key)) {
        let value: unknown = source[key];

        if (isDeep) {
          if (Array.isArray(value)) {
            // An array replaces what the target holds rather than merging into
            // it, so whatever was recorded for this one can always be reused;
            // `_copyDeep` reads the map itself.
            value = _copyDeep(value, isInherited, copies);
          } else if (isObjectCoercible(value)) {
            const sourceObject = value as Record<string, unknown>;
            const targetValue = target[key];
            if (isObjectCoercible(targetValue)) {
              const existingTarget = targetValue as Record<string, unknown>;
              // What the target already holds here is merged into, whatever
              // this source came back as somewhere else: handing back that
              // other object would drop every property this one already has.
              //
              // For as long as that merge runs, this source stands for the
              // object it is being merged into, so a cycle within it closes on
              // that object rather than on the one another path produced.
              // Afterwards the earlier stand-in goes back, so a later path
              // with nothing of its own to keep still arrives at it; where
              // there was none, this object becomes it and the write below is
              // the one that records it.
              const standIn = copies.has(sourceObject)
                ? copies.get(sourceObject)
                : existingTarget;
              copies.set(sourceObject, existingTarget);
              value = _mixin<Record<string, unknown>, Record<string, unknown>>({
                deep: true,
                inherited: isInherited,
                sources: [sourceObject],
                target: existingTarget,
                copies,
                merged,
              });
              copies.set(sourceObject, standIn);
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
              });
            }
          }
        }
        target[key] = value;
      }
    }
  }

  return target as T & U;
}
