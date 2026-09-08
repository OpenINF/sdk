// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Returns the property descriptor for the own property of `obj` whose key
 * is `key`, or `undefined` if no such property exists (that is, a property
 * directly present on the object and not in the object's prototype chain).
 * @since 3.0.0
 * @category Object
 * @param obj The target object in which to look for the property.
 * @param key The name of the property to get a property descriptor for.
 * @returns The property descriptor object for `key` if `key` exists in `obj`;
 * else, `undefined`.
 */
export function getPropertyDescriptor<P extends PropertyKey>(
  obj: Record<P, unknown>,
  key: P
): PropertyDescriptor | undefined {
  return Object.getOwnPropertyDescriptor(obj, key);
}
