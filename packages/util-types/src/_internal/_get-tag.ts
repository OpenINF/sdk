// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Gets the [`toStringTag`](https://mdn.io/Symbol/toStringTag) (previously the
 * ECMAScript [[Class]] internal property) of `value`.
 * @private
 * @param value The value to query.
 * @returns The `toStringTag` of `value`.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString#usingtostring_to_detect_object_class
 */
export function getTag(value: unknown): string {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return Object.prototype.toString.call(value);
}
