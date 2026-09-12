// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from TypeShield.

import type { Guard, Validator } from '@openinf/util-core';

import { isObjectLike } from './is-object-like';

/**
 * Extract an object of types from an object of guards.
 */
export type ExtractProperties<T extends PropertyValidators> = {
  [TP in keyof T]: T[TP] extends Guard<infer U> ? U : unknown;
};

/**
 * A collection of property validators.
 */
export interface PropertyValidators {
  [key: string]: Validator;
  [key: symbol]: Validator;
}

/**
 * Creates a guard that detects whether a value is an object with properties
 * matching the specified property validators.
 * @param validators The property validators.
 * @returns The guard.
 */
export function hasProperties<T extends PropertyValidators>(
  validators: T
): Guard<ExtractProperties<T>> {
  const guard = (value: unknown): value is ExtractProperties<T> => {
    if (!isObjectLike(value)) return false;

    const record = value as Record<PropertyKey, unknown>;
    const validatorRecord = validators as Record<PropertyKey, Validator>;
    return Reflect.ownKeys(validators).every((key) => {
      if (!(key in record)) return false;

      // key comes from Reflect.ownKeys(validators), so it is guaranteed present.
      // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
      return validatorRecord[key]!(record[key]);
    });
  };
  (guard as Guard).expectation = 'have specified properties';

  return guard;
}
