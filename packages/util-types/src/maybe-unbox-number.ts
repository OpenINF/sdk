// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/* oxlint-disable typescript/no-wrapper-object-types -- this module works with boxed Number objects specifically. */
import { isNumberObject } from './guards/is-number-object';

// oxlint-disable-next-line typescript/unbound-method -- intentionally unbound; rebound below via .call().
const unboundNumberValueOf: () => number = Number.prototype.valueOf;
const numberValueOf = (value: Number): number =>
  unboundNumberValueOf.call(value);

/**
 * Unboxes a number if it is a boxed primitive object.
 * @param value A number primitive or number boxed primitive.
 * @returns A number primitive.
 */
export function maybeUnboxNumber(value: number | Number): number {
  return isNumberObject(value) ? numberValueOf(value) : (value as number);
}
