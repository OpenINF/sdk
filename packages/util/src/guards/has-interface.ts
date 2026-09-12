// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield
// https://github.com/dtjohnson/typeshield/blob/master/src/guards/has-interface.ts

import type { Guard } from '@openinf/util-core';

/**
 * Collection of interface validators.
 */
export type InterfaceValidators<T> = {
  /**
   * Property validators.
   */
  [TP in keyof T]-?: Guard<T[TP] extends () => unknown ? () => unknown : T[TP]>; // Squash functions as we don't verify call signatures or return types.
};

/**
 * Creates a guard that tests if a value implements a specified interface.
 * @param interfaceName The interface name to report in the error message.
 * @param validators The property validators (or function that returns them).
 * @returns The guard.
 * @example
 * ```ts
 * import { hasInterface, isNumber, isString } from '@openinf/util';
 *
 * interface Point {
 *   x: number;
 *   y: number;
 * }
 *
 * const isPoint = hasInterface<Point>('Point', {
 *   x: isNumber,
 *   y: isNumber,
 * });
 *
 * isPoint({ x: 0, y: 0 }); // ↪ true
 *
 * isPoint({ x: 0 }); // ↪ false
 * ```
 */
export function hasInterface<T>(
  interfaceName: string,
  validators: InterfaceValidators<T> | (() => InterfaceValidators<T>)
): Guard<T> {
  const guard: Guard<T> = (value: unknown): value is T => {
    if (value === null || typeof value !== 'object') {
      return false;
    }

    const resolvedValidators =
      typeof validators === 'function' ? validators() : validators;
    const validatorRecord = resolvedValidators as Record<PropertyKey, Guard>;
    const valueRecord = value as Record<PropertyKey, unknown>;

    return Reflect.ownKeys(resolvedValidators).every(
      (key) =>
        key in valueRecord &&
        // key comes from Reflect.ownKeys(resolvedValidators), so it is guaranteed present.
        // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
        validatorRecord[key]!(valueRecord[key])
    );
  };
  guard.expectation = `implement '${interfaceName}'`;

  return guard;
}
