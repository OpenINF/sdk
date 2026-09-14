// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

const descriptor = Object.getOwnPropertyDescriptor(
  Object.getPrototypeOf(Uint8Array.prototype) as object,
  Symbol.toStringTag
);
const { apply } = Reflect;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const getName = descriptor?.get as (this: unknown) => string | undefined;

/**
 * Reads [[TypedArrayName]] directly, without consulting the object's tag.
 * Unlike element-access methods, this also works on detached arrays.
 * @private
 * @param value The value to query.
 * @returns Its typed-array name, or `undefined` if it is not a typed array.
 */
export function _typedArrayName(value: unknown): string | undefined {
  return apply(getName, value, []);
}
