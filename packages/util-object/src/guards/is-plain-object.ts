// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from jQuery

import { _isPlainObject } from '@openinf/util-core';

/**
 * Detects whether `value` is a plain object: an object whose `[[Prototype]]`
 * is `Object.prototype` or `null`, and which `Object.prototype.toString`
 * classifies as `Object` by its internal slots.
 *
 * That classification, in section 20.1.3.6 of the specification, is the
 * language's own. It sets arrays, functions, arguments objects, Errors, boxed
 * Booleans, Numbers and Strings, Dates and RegExps apart by the internal slots
 * they are created with, so replacing one's prototype does not make it plain.
 * A tag is not a slot, so an object literal that sets `Symbol.toStringTag` is
 * still plain, and so are namespace objects such as `Math`. A module namespace
 * object, being exotic, is not.
 *
 * Other built-in objects, a `Map` for instance, are told apart only by the
 * `Symbol.toStringTag` of their prototype. One whose prototype has been
 * replaced with `Object.prototype` is classified as `Object`, and so is plain
 * here. Proving that an object has no `[[MapData]]`, or any of the other
 * slots, would take a probe that throws for every kind of built-in, on every
 * plain object this is asked about.
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
  return _isPlainObject(value);
}
