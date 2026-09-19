// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

const { apply } = Reflect;
const { getOwnPropertyDescriptor } = Object;

/**
 * Captures a prototype accessor once and reads it from a value, answering
 * `false` rather than throwing when the value has no internal slot for the
 * accessor to read.
 *
 * The accessor comes from the intrinsic and never from the value, so neither
 * a later change to the prototype nor an own property on the value can
 * redirect it. Reading a state accessor leaves the value as it found it.
 * @param constructor The intrinsic owning the accessor, absent in a runtime
 * without it.
 * @param key The accessor's property key.
 * @returns A predicate answering whether the accessor reads `true`.
 */
export function _accessorValue(
  constructor: { prototype: object } | undefined,
  key: PropertyKey
): (value: unknown) => boolean {
  const get =
    constructor === undefined
      ? undefined
      : // oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
        (getOwnPropertyDescriptor(constructor.prototype, key)?.get as
          ((this: unknown) => unknown) | undefined);
  return (value) => {
    if (get === undefined || value === null || typeof value !== 'object') {
      return false;
    }
    try {
      return apply(get, value, []) === true;
    } catch {
      return false;
    }
  };
}
