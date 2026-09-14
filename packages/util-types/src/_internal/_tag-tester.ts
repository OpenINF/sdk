// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _brandChecks } from './_brand-checks';
import { _getPropertyDescriptor } from './_get-property-descriptor';
import { _matchesBrandShape } from './_matches-brand-shape';

// Adapted from Underscore; use internal-slot checks where the language exposes
// a non-mutating probe. The remaining tag checks are classification heuristics,
// not proof of a brand. See the package README for the boundary.

const { apply } = Reflect;
const { hasOwn } = Object;
const { toStringTag } = Symbol;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const objectToString = Object.prototype.toString;
// oxlint-disable-next-line typescript/unbound-method -- invoked with captured Reflect.apply.
const mapGet = Map.prototype.get;

/**
 * Creates a built-in tester, supplementing Underscore's tag comparison with
 * descriptor-based shape checks when an internal-slot probe is unavailable.
 * @private
 * @param name The name of the type.
 * @returns The `tagTester` function.
 */
export function _tagTester(name: string): (value: unknown) => boolean {
  const check = apply(mapGet, _brandChecks, [name]) as
    ((value: unknown) => boolean) | undefined;
  if (check !== undefined) return check;

  const tag = '[object ' + name + ']';
  return function (value: unknown): boolean {
    try {
      if (
        value === null ||
        (typeof value !== 'object' && typeof value !== 'function')
      ) {
        return false;
      }
      const descriptor = _getPropertyDescriptor(value, toStringTag);
      if (
        descriptor !== undefined &&
        (!hasOwn(descriptor, 'value') ||
          typeof descriptor.value !== 'string' ||
          descriptor.enumerable ||
          descriptor.writable)
      ) {
        return false;
      }
      // Read a tag's data descriptor directly, never its getter. Arguments have
      // a legacy intrinsic tag when no string-valued custom tag is present.
      const actualTag =
        descriptor !== undefined
          ? '[object ' + descriptor.value + ']'
          : name === 'Arguments'
            ? apply(objectToString, value, [])
            : undefined;
      return actualTag === tag && _matchesBrandShape(name, value);
    } catch {
      // A revoked proxy or throwing proxy trap is not a recognized type.
      return false;
    }
  };
}
