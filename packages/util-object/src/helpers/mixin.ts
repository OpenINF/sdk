// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Dojo Framework.

import { _mixin } from '../_internal/_mixin';

/**
 * Copies the values of all enumerable (own or inherited) properties of one or
 * more source objects to the target object.
 * @returns The modified target object
 */
export function mixin<
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
export function mixin<
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
export function mixin<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
  V extends Record<string, unknown>,
  W extends Record<string, unknown>,
  X extends Record<string, unknown>,
>(target: T, source1: U, source2: V, source3: W, source4: X): T & U & V & W & X;
export function mixin<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
  V extends Record<string, unknown>,
  W extends Record<string, unknown>,
>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export function mixin<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
  V extends Record<string, unknown>,
>(target: T, source1: U, source2: V): T & U & V;
export function mixin<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
>(target: T, source: U): T & U;
export function mixin(
  target: Record<string, unknown>,
  ...sources: Record<string, unknown>[]
): Record<string, unknown> {
  return _mixin({
    deep: false,
    inherited: true,
    sources: sources,
    target: target,
  });
}
