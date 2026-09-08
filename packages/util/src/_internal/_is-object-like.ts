// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isNull } from '@openinf/util-core';
import type { Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is an object. A value is object-like if it has
 * a `typeof` result of "object" and is not `null`. Because `null` unexpectedly
 * has a `typeof` result of "object", its exclusion is special-cased to avoid
 * false-positives.
 * the ECMAScript
 * [language type](https://tc39.es/ecma262/#sec-ecmascript-language-types) of
 * [`Object`](https://tc39.es/ecma262/#sec-object-type) (e.g. arrays, functions,
 * objects, regexes, `new Number(0)`, and `new String('')`).
 * @since 3.0.0
 * @category Fundamental Object
 * @param value The value to identify.
 * @returns `true` if `value` is object-like; else, `false`.
 * @example ```ts
 * isObjectLike({}); // ↪ true
 *
 * isObjectLike([1, 2, 3]); // ↪ true
 *
 * isObjectLike(noop); // ↪ true
 *
 * isObjectLike(null); // ↪ false
 * ```
 */
export function _isObjectLike(
  value: unknown
): value is Record<string, unknown> {
  const type = typeof value;
  return !isNull(value) && (type === 'object' || type === 'function');
}
(_isObjectLike as Guard).expectation = 'be object-like';
