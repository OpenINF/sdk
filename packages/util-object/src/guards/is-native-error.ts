// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Determines whether the passed value is one of the native error types:
 * - [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError)
 * - [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
 * - [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)
 * - [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError)
 * - [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
 * - [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError)
 * - [`AggregateError `](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
 * - [`InternalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/InternalError)
 *
 * Asks whether the value has the `[[ErrorData]]` internal slot, as
 * `Error.isError` does, and uses it where available. On the Node.js 22 line,
 * which lacks it, `node:util`'s `types.isNativeError` asks the same question,
 * so every supported Node.js gives the same answer. Other engines without
 * either fall back to the legacy cross-realm tag, and to local error ancestry
 * when a custom tag hides it; forged prototypes and proxy traps can fool that
 * fallback. Do not use it as a security boundary.
 * @category Fundamental Objects
 * @param value The value to be checked.
 * @returns `true` if the value is a native error; otherwise, `false`.
 */
export function isNativeError(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('Error')(value);
}
