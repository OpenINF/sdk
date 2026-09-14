// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

const { getOwnPropertyDescriptor, getPrototypeOf } = Object;
const InspectionError = TypeError;

/**
 * Finds an inherited or own descriptor without executing ordinary getters.
 * Proxy traps can still run. Bound the walk because a proxy can invent a
 * cyclic or endlessly changing prototype chain.
 * @private
 * @param value The object to inspect.
 * @param key The property to find.
 * @returns The descriptor, or `undefined` if the property is absent.
 */
export function _getPropertyDescriptor(
  value: object,
  key: PropertyKey
): PropertyDescriptor | undefined {
  let current: object | null = value;
  for (let depth = 0; current !== null && depth < 64; depth += 1) {
    const descriptor = getOwnPropertyDescriptor(current, key);
    if (descriptor !== undefined) return descriptor;
    current = getPrototypeOf(current) as object | null;
  }
  if (current !== null)
    throw new InspectionError('Prototype inspection limit exceeded');
  return undefined;
}
