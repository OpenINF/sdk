// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { AnyConstructor, Guard } from '@openinf/util-core';

/**
 * Detects whether `value` can be called with `new`.
 * @since 3.0.0
 * @category Fundamental Objects
 * @param value The value to identify.
 * @returns `true` if `value` is a constructor; else, `false`.
 * @example ```ts
 * class Foo {}
 *
 * isConstructor(Foo); // ↪ true
 *
 * isConstructor(() => {}); // ↪ false
 *
 * isConstructor(Array.prototype.map); // ↪ false
 * ```
 */
export function isConstructor(value: unknown): value is AnyConstructor {
  if (typeof value !== 'function') {
    return false;
  }
  try {
    Reflect.construct(String, [], value);
  } catch {
    return false;
  }
  return true;
}
(isConstructor as Guard).expectation = 'be a constructor';
