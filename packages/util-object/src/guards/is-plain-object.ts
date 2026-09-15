// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from jQuery

import { _tagTester } from '@openinf/util-core';

import { hasOwn } from './has-own';

const { apply } = Reflect;
const { getPrototypeOf } = Object;
const { toStringTag } = Symbol;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const objectToString = Object.prototype.toString;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const functionToString = Function.prototype.toString;
const objectFunctionString: unknown = apply(functionToString, Object, []);

// The internal slots section 20.1.3.6 classifies an object by, apart from
// IsArray and [[Call]], which are tested directly. These are asked only when a
// Symbol.toStringTag hides the classification Object.prototype.toString would
// otherwise report. Two of them have no probe in every runtime: nothing in the
// language reveals [[ParameterMap]] but that same classification, and
// [[ErrorData]] is revealed only by Error.isError, from ES2026. So an arguments
// object, or an Error where Error.isError is missing, that has been given both
// another prototype and a tag of its own cannot be recognized, and passes as
// plain.
const hasClassifyingSlot = [
  'Arguments',
  'Error',
  'Boolean',
  'Number',
  'String',
  'Date',
  'RegExp',
].map((name) => _tagTester(name));

// A module namespace object is exotic, and always carries its own tag.
const isModuleNamespace = _tagTester('Module');

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
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const proto: unknown = getPrototypeOf(value);

  // Otherwise, plain only if the prototype's constructor is the global Object.
  if (proto !== null) {
    const protoRecord = proto as Record<PropertyKey, unknown>;
    const ctor = hasOwn(protoRecord, 'constructor')
      ? protoRecord.constructor
      : undefined;

    if (
      typeof ctor !== 'function' ||
      apply(functionToString, ctor, []) !== objectFunctionString
    ) {
      return false;
    }
  }

  // With no tag in the way, Object.prototype.toString reports the
  // classification itself, without a probe that has to throw.
  if (!(toStringTag in value)) {
    return apply(objectToString, value, []) === '[object Object]';
  }

  return (
    !hasClassifyingSlot.some((hasSlot) => hasSlot(value)) &&
    !isModuleNamespace(value)
  );
}
