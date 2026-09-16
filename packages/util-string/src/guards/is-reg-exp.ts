// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as a
 * [`RegExp`](https://mdn.io/Global_Objects/RegExp) object.
 *
 * This asks for the `[[RegExpMatcher]]` internal slot only the `RegExp`
 * constructor gives an object, as `node:util`'s `types.isRegExp` does. It is
 * not the specification's IsRegExp operation, section 7.2.6, which the string
 * methods use: that one asks for `Symbol.match` first, so an ordinary object
 * carrying that property counts as a regular expression for them, and does not
 * here.
 * @since 3.0.0
 * @category Text Processing
 * @param value The value to identify.
 * @returns `true` if `value` is a `RegExp`; else, `false`.
 * @example
 * ```ts
 * isRegExp(/abc/); // ↪ true
 *
 * isRegExp('/abc/'); // ↪ false
 *
 * isRegExp({ [Symbol.match]: true }); // ↪ false
 * ```
 */
export function isRegExp(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('RegExp')(value);
}
