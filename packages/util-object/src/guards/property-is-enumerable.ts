// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Since `Object.prototype.propertyIsEnumerable` only considers own
// properties, it doesn't tell you whether an inherited property is
// enumerable. This walks the prototype chain to the object that actually
// owns `key` and checks enumerability there.

/**
 * Detects whether `key` is an enumerable property of `obj`, walking the
 * prototype chain if `key` is inherited.
 * @since 3.0.0
 * @category Object
 * @param obj The object to query.
 * @param key A property name.
 * @returns `true` if `key` is an enumerable property of `obj`; else, `false`.
 */
export function propertyIsEnumerable<P extends PropertyKey>(
  obj: Record<P, unknown>,
  key: P
): boolean {
  if (!(key in obj)) {
    return false;
  }

  let current: unknown = obj;
  while (current !== null && current !== undefined) {
    if (Object.prototype.hasOwnProperty.call(current, key)) {
      return Object.prototype.propertyIsEnumerable.call(current, key);
    }
    current = Object.getPrototypeOf(current);
  }

  return false;
}
