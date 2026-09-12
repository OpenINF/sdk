// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { hasProperties } from '@openinf/util-object';

import type { Guard } from '../types';

// https://github.com/dtjohnson/typeshield/blob/master/src/guards/has-interface.ts

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
 */
export function hasInterface<T>(
  interfaceName: string,
  validators: InterfaceValidators<T> | (() => InterfaceValidators<T>)
): Guard<T> {
  const guard: Guard<T> = (value: unknown): value is T => {
    const resolvedValidators =
      typeof validators === 'function' ? validators() : validators;

    // InterfaceValidators is a finite mapped type, while hasProperties accepts
    // an open validator map. They describe the same runtime shape here.
    return hasProperties(resolvedValidators as any)(value);
  };
  guard.expectation = `implement '${interfaceName}'`;
  return guard;
}
