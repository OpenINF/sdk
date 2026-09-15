// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is likely an
 * [`arguments`](https://mdn.io/Reference/Functions/arguments) object.
 * This is a tag-and-shape heuristic, not an internal-brand guarantee. It
 * avoids calling ordinary getters, but a carefully constructed object or
 * proxy can produce false positives. Do not use it as a security boundary.
 * @since 3.0.0
 * @category Exotic Objects
 * @param value The value to identify.
 * @returns `true` if `value` is an `arguments` object; else, `false`.
 * @example
 * isArgumentsObject(function() { return arguments }()); // ↪ true
 *
 * (arg0, arg1, arg2) => { return isArgumentsObject(arguments) } // ↪ true
 *
 * (args) => { return isArgumentsObject(args) } // ↪ false
 */
export function isArgumentsObject(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Arguments')(value);
}
