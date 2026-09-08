// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Takes an object, a property name, and a factory function. If the value of
 * the property is undefined, it generates a value with the factory function,
 * updates the object originally passed, and returns the value that was returned
 * by the factory function.
 * @param obj The object to read from and, if necessary, write to.
 * @param prop The property name to look up.
 * @param factory The function used to generate a value if `obj[prop]` is
 * undefined.
 * @returns The existing or newly generated value of `obj[prop]`.
 */
export function memo<T, P extends keyof T>(
  obj: T,
  prop: P,
  factory: (arg0: T, arg1: P) => T[P]
): T[P] {
  let result = obj[prop];
  if (result === undefined) {
    result = factory(obj, prop);
    obj[prop] = result;
  }
  return result;
}
