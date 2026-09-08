// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { AnyFunction } from '@openinf/util-core';

/**
 * Walks up `obj`'s prototype chain and returns the first named constructor
 * function found.
 * @param obj The object to inspect.
 * @returns The constructor function, or `null` if none was found.
 */
export function getConstructorOf(obj: unknown): AnyFunction | null {
  let current: unknown = obj;
  while (current !== null && current !== undefined) {
    const descriptor = Object.getOwnPropertyDescriptor(current, 'constructor');
    const value = descriptor?.value as unknown;
    if (typeof value === 'function' && value.name !== '') {
      return value as AnyFunction;
    }

    current = Object.getPrototypeOf(current) as unknown;
  }

  return null;
}
