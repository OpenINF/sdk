// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Dojo Framework.

import { copyArray } from '@openinf/util-array';

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
  copied?: Set<unknown>;
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
  // A Set, not an array: this is consulted once per source property, so a
  // linear scan made mixing an object with n properties quadratic.
  const copied = kwArgs.copied ?? new Set<unknown>();

  for (const source of kwArgs.sources) {
    if (source === null || source === undefined) {
      continue;
    }
    for (const key in source) {
      // Skipped silently: reading `target[key]` below would otherwise resolve
      // `__proto__` through the prototype chain and merge into the shared
      // `Object.prototype` itself.
      if (_isUnsafeKey(key)) {
        continue;
      }
      if (isInherited || hasOwn(source, key)) {
        let value: unknown = source[key];

        if (copied.has(value)) {
          continue;
        }

        if (isDeep) {
          if (Array.isArray(value)) {
            value = copyArray(value, isInherited);
          } else if (isObjectCoercible(value)) {
            const targetValue = target[key];
            copied.add(source);
            value = _mixin<Record<string, unknown>, Record<string, unknown>>({
              deep: true,
              inherited: isInherited,
              sources: [value as Record<string, unknown>],
              target: isObjectCoercible(targetValue)
                ? (targetValue as Record<string, unknown>)
                : {},
              copied,
            });
          }
        }
        target[key] = value;
      }
    }
  }

  return target as T & U;
}
