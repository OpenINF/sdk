// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from jQuery

import { isObjectOfType } from '../types';
import { hasOwn } from './has-own';
import { isObjectLike } from './is-object-like';

const objectFunctionString = Function.prototype.toString.call(Object);

/**
 * Detects whether `value` is a plain object, that is, an object created by
 * the `Object` constructor or one with a `[[Prototype]]` of `null`.
 * @since 3.0.0
 * @category Fundamental Objects
 * @param value The value to identify.
 * @returns `true` if `value` is a plain object; else, `false`.
 * @example
 * ```ts
 * function Foo() {
 *   this.a = 1
 * }
 *
 * isPlainObject(new Foo); // ↪ false
 *
 * isPlainObject([1, 2, 3]); // ↪ false
 *
 * isPlainObject({ 'x': 0, 'y': 0 }); // ↪ true
 *
 * isPlainObject(Object.create(null)); // ↪ true
 * ```
 */
export function isPlainObject(value: unknown): boolean {
  // Detect obvious negatives
  if (!isObjectLike(value) || !isObjectOfType('Object')(value)) {
    return false;
  }

  const proto: unknown = Object.getPrototypeOf(value);

  // Objects with no prototype (e.g. `Object.create(null)`) are plain
  if (proto === null) {
    return true;
  }

  // Objects with a prototype are plain iff they were constructed by the
  // global `Object` function.
  const protoRecord = proto as Record<PropertyKey, unknown>;
  const ctor = hasOwn(protoRecord, 'constructor')
    ? protoRecord.constructor
    : undefined;

  return (
    typeof ctor === 'function' &&
    Function.prototype.toString.call(ctor) === objectFunctionString
  );
}
