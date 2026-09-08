// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

import { _isObjectLike } from '../_internal/_is-object-like';

/**
 * A value that is of a primitive data type.
 */
export type Primitive =
  string | number | boolean | bigint | symbol | undefined | null;

/**
 * Detects whether `value` is of a
 * [**primitive**](https://mdn.io/Glossary/Primitive)
 * data type.
 * @since 3.0.0
 * @category Other
 * @param value The value to identify.
 * @returns `true` if `value` is a primitive; else, `false`.
 * @example ```ts
 * import util from '@openinf/util';
 *
 * util.isPrimitive(0); // ↪ true
 *
 * util.isPrimitive(new Number(0)); // ↪ false
 *
 * util.isPrimitive('foo'); // ↪ true
 *
 * util.isPrimitive(false); // ↪ true
 *
 * util.isPrimitive(new Boolean(true)); // ↪ false
 *
 * util.isPrimitive(null); // ↪ true
 *
 * util.isPrimitive(undefined); // ↪ true
 *
 * util.isPrimitive({}); // ↪ false
 *
 * util.isPrimitive(() => {}); // ↪ false
 *
 * util.isPrimitive(/^$/); // ↪ false
 *
 * util.isPrimitive(new Date()); // ↪ false
 * ```
 */
export function isPrimitive(value: unknown): value is Primitive {
  return value === null || !_isObjectLike(value) ? true : false;
}
(isPrimitive as Guard).expectation = 'be of a primitive data type';
