// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { isObjectLike } from '@openinf/util-object';

import { _tagTester } from '../_internal/_tag-tester';

/**
 * Detects whether `value` is likely an
 * [`arguments`](https://mdn.io/Reference/Functions/arguments) object.
 * @since 3.0.0
 * @category Other
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
