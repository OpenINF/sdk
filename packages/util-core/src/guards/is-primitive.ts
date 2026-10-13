// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '../types';
import { isObjectLike } from './is-object-like';

/**
 * A value that is of a primitive data type.
 * @category Data Types and Values
 */
export type Primitive =
  string | number | boolean | bigint | symbol | undefined | null;

/**
 * Detects whether `value` is of a
 * [**primitive**](https://mdn.io/Glossary/Primitive)
 * data type.
 * @since 3.0.0
 * @category Data Types and Values
 * @param value The value to identify.
 * @returns `true` if `value` is a primitive; else, `false`.
 * @example
 * ```ts
 * import { isPrimitive } from '@openinf/util-core';
 *
 * isPrimitive(0); // ↪ true
 *
 * isPrimitive(new Number(0)); // ↪ false
 *
 * isPrimitive('foo'); // ↪ true
 *
 * isPrimitive(false); // ↪ true
 *
 * isPrimitive(new Boolean(true)); // ↪ false
 *
 * isPrimitive(null); // ↪ true
 *
 * isPrimitive(undefined); // ↪ true
 *
 * isPrimitive({}); // ↪ false
 *
 * isPrimitive(() => {}); // ↪ false
 *
 * isPrimitive(/^$/); // ↪ false
 *
 * isPrimitive(new Date()); // ↪ false
 * ```
 */
export function isPrimitive(value: unknown): value is Primitive {
  return value === null || !isObjectLike(value) ? true : false;
}
(isPrimitive as Guard).expectation = 'be of a primitive data type';
