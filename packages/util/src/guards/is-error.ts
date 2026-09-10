// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Jest.
// https://github.com/facebook/jest/blob/bc50e7f360ab1845abbaa0b3ad788caead0d3174/packages/jest-jasmine2/src/isError.ts

import type { Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is classified as an
 * [`Error`](https://mdn.io/Global_Objects/Error) object.
 * @since 3.0.0
 * @category Fundamental Objects
 * @param value The value to identify.
 * @returns `true` if `value` is an `Error`; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isError(new Error('foo')); // ↪ true
 *
 * util.isError({ message: 'foo', name: 'bar' }); // ↪ false
 * ```
 */
export function isError(value: unknown): value is globalThis.Error {
  const toStringOutput = Object.prototype.toString.call(value);
  return (
    toStringOutput === '[object Error]' ||
    toStringOutput === '[object Exception]' ||
    toStringOutput === '[object DOMException]' ||
    value instanceof globalThis.Error
  );
}
(isError as Guard).expectation = 'be an Error object';
