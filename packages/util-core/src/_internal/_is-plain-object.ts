// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester } from './_tag-tester';

const { apply } = Reflect;
const { getPrototypeOf } = Object;
const { toStringTag } = Symbol;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const objectToString = Object.prototype.toString;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const functionToString = Function.prototype.toString;
const objectFunctionString = apply(functionToString, Object, []);
const hasClassifyingSlot = [
  'Arguments',
  'Error',
  'Boolean',
  'Number',
  'String',
  'Date',
  'RegExp',
].map((name) => _tagTester(name));
const isModuleNamespace = _tagTester('Module');

/**
 * The shared plain-object check used by object guards and graph copying.
 * @private
 * @param value The value to inspect.
 * @returns Whether the value has an ordinary object prototype and slots.
 */
export function _isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const proto: unknown = getPrototypeOf(value);
  if (proto !== null) {
    const ctor = Object.hasOwn(proto as object, 'constructor')
      ? (proto as { constructor: unknown }).constructor
      : undefined;
    if (
      typeof ctor !== 'function' ||
      apply(functionToString, ctor, []) !== objectFunctionString
    ) {
      return false;
    }
  }
  if (!(toStringTag in value)) {
    return apply(objectToString, value, []) === '[object Object]';
  }
  return (
    !hasClassifyingSlot.some((hasSlot) => hasSlot(value)) &&
    !isModuleNamespace(value)
  );
}
