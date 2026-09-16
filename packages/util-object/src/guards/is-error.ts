// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Jest.
// https://github.com/facebook/jest/blob/bc50e7f360ab1845abbaa0b3ad788caead0d3174/packages/jest-jasmine2/src/isError.ts

import type { Guard } from '@openinf/util-core';

/**
 * Detects whether `value` is Error-like: an object the language, a host, or
 * another realm treats as an error.
 *
 * It accepts anything with the current realm's `globalThis.Error.prototype` in
 * its prototype chain, and anything tagged `Error`, `Exception` or
 * `DOMException`. Cross-realm native errors can therefore pass through the tag
 * check. An object made by `Object.create(Error.prototype)`, which has no error
 * of its own to report, passes in the current realm too.
 *
 * For the narrower question of whether a value was created as an error, and
 * has the `[[ErrorData]]` internal slot to show for it, use `isNativeError`,
 * which is what `Error.isError` asks.
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
 *
 * util.isError(Object.create(Error.prototype)); // ↪ true
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
