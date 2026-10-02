// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield
// https://github.com/dtjohnson/typeshield/blob/master/src/guards/has-interface.ts

import type { Guard } from '../types';
import { isObjectLike } from './is-object-like';

type IndexKey<T extends object> = {
  [Key in keyof Required<T>]: {} extends Pick<Required<T>, Key> ? Key : never;
}[keyof T];

type SupportsInterface<T, Whole = T> = T extends object
  ? [Whole] extends [T]
    ? T extends (...args: never[]) => unknown
      ? false
      : T extends abstract new (...args: never[]) => unknown
        ? false
        : [IndexKey<T>] extends [never]
          ? true
          : false
    : false
  : false;

/**
 * Validators for every required property of a finite, non-callable interface.
 * Call signatures, constructors, index signatures, and unions cannot be
 * established by checking a fixed list of properties and are rejected.
 * @category Testing and Comparison Operations
 */
export type InterfaceValidators<T extends object> = [T] extends [never]
  ? never
  : SupportsInterface<T> extends true
    ? {
        /**
         * Property validators, including a property's complete function type.
         */
        [TP in keyof T]-?: Guard<Required<T>[TP]>;
      }
    : never;

/**
 * Creates a guard that tests if a value implements a specified interface.
 * Every listed property must be present, including properties optional in `T`,
 * so the result narrows to `Required<T>`. Only objects and functions pass;
 * primitive values with matching properties do not. Each validator must prove
 * the property's full type, including a method's arguments and return type.
 * @since 3.0.0
 * @category Testing and Comparison Operations
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
export function hasInterface<T extends object>(
  interfaceName: string,
  validators: InterfaceValidators<T> | (() => InterfaceValidators<T>)
): Guard<Required<T> & object> {
  const guard: Guard<Required<T> & object> = (
    value: unknown
  ): value is Required<T> & object => {
    // A function is an object, and can implement an interface as well as any
    // other object can: a class with static members, for instance.
    if (!isObjectLike(value)) {
      return false;
    }

    const resolvedValidators =
      typeof validators === 'function' ? validators() : validators;
    const validatorRecord = resolvedValidators as Record<PropertyKey, Guard>;
    const valueRecord = value as Record<PropertyKey, unknown>;
    const keys = new Set<PropertyKey>();
    let current: object | null = resolvedValidators;

    // Validator maps can be class instances, whose declarations live on the
    // prototype as non-enumerable accessors. Walk those declarations without
    // accidentally treating Object.prototype itself as part of the map.
    while (current !== null && current !== Object.prototype) {
      for (const key of Reflect.ownKeys(current)) {
        if (key !== 'constructor') keys.add(key);
      }
      current = Object.getPrototypeOf(current) as object | null;
    }

    return [...keys].every(
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
