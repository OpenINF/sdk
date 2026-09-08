// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Detects whether `obj` has `key` as its own property (as opposed to having
 * inherited it).
 *
 * Narrows `obj` on success, so the property can be read afterward without a
 * cast. `obj` is accepted as any `object`, matching `Object.hasOwn`: typing it
 * as `Record<P, unknown>` would require the caller to already have a value
 * known to carry the very property being tested for, which is the question
 * this answers.
 * @since 3.0.0
 * @category Object
 * @param obj The object to query.
 * @param key A property name.
 * @returns `true` iff `key` is an own property of `obj`; else, `false`.
 * @example
 * ```ts
 * import { hasOwn } from '@openinf/util-object';
 *
 * const value: object = JSON.parse(input);
 *
 * if (hasOwn(value, 'id')) {
 *   value.id; // narrowed, no cast needed
 * }
 * ```
 */
export function hasOwn<T extends object, P extends PropertyKey>(
  obj: T,
  key: P
): obj is T & Record<P, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
