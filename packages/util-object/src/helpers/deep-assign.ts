// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _mixin } from '../_internal/_mixin';

export function deepAssign<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
  V extends Record<string, unknown>,
  W extends Record<string, unknown>,
  X extends Record<string, unknown>,
  Y extends Record<string, unknown>,
  Z extends Record<string, unknown>,
>(
  target: T,
  source1: U,
  source2: V,
  source3: W,
  source4: X,
  source5: Y,
  source6: Z
): T & U & V & W & X & Y & Z;
export function deepAssign<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
  V extends Record<string, unknown>,
  W extends Record<string, unknown>,
  X extends Record<string, unknown>,
  Y extends Record<string, unknown>,
>(
  target: T,
  source1: U,
  source2: V,
  source3: W,
  source4: X,
  source5: Y
): T & U & V & W & X & Y;
export function deepAssign<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
  V extends Record<string, unknown>,
  W extends Record<string, unknown>,
  X extends Record<string, unknown>,
>(target: T, source1: U, source2: V, source3: W, source4: X): T & U & V & W & X;
export function deepAssign<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
  V extends Record<string, unknown>,
  W extends Record<string, unknown>,
>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export function deepAssign<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
  V extends Record<string, unknown>,
>(target: T, source1: U, source2: V): T & U & V;
export function deepAssign<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
>(target: T, source: U): T & U;
/**
 * Copies the values of all enumerable own properties of one or more source
 * objects to the target object, recursively copying all nested objects and
 * arrays as well.
 * @param target The target object to receive values from source objects
 * @param sources Any number of objects whose enumerable own properties will be
 * copied to the target object
 * @returns The modified target object
 */
export function deepAssign(
  target: Record<string, unknown>,
  ...sources: Record<string, unknown>[]
): Record<string, unknown> {
  return _mixin({
    deep: true,
    inherited: false,
    sources: sources,
    target: target,
  });
}
