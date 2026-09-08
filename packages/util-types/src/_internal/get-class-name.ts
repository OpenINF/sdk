// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { getTag } from './_get-tag';

/**
 * Gets the [`toStringTag`](https://mdn.io/Symbol/toStringTag) (previously the
 * ECMAScript [[Class]] internal property) of `value`.
 *
 * When the toString method is called, the following steps are taken:
 * 1. Get the [`toStringTag`](https://mdn.io/Symbol/toStringTag) (previously
 * the ECMAScript [[Class]] internal property) of a value.
 * 2. Compute a string value by concatenating the three strings "[object ",
 * Result (1), and "]".
 * 3. Return Result (2).
 *
 * getClass(5); // ↪ "Number"
 * getClass({}); // ↪ "Object"
 * getClass(/foo/); // ↪ "RegExp"
 * getClass(''); // ↪ "String"
 * getClass(true); // ↪ "Boolean"
 * getClass([]); // ↪ "Array"
 * getClass(undefined); // ↪ "Window"
 * getClass(Element); // ↪ "Constructor"
 * @private
 * @param value The value to query.
 * @returns The name of the class associated with the value.
 */
export function getClassName(value: unknown): string {
  const match = /^\[object\s(.*)\]$/.exec(getTag(value));
  // Group 1 is not optional in the pattern, so it is present whenever match is.
  // oxlint-disable-next-line typescript/no-unnecessary-type-assertion -- oxlint-tsgolint doesn't currently honor noUncheckedIndexedAccess; tsc does require this.
  return match ? match[1]! : '';
}
