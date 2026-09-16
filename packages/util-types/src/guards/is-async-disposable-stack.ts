// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is
 * an [`AsyncDisposableStack`](https://mdn.io/Global_Objects/AsyncDisposableStack), the asynchronous counterpart of a `DisposableStack`, section 27.4 of the specification.
 *
 * The check asks for the internal slots only `AsyncDisposableStack` gives an object,
 * through a probe that leaves the value as it found it, so an object carrying
 * `Symbol.toStringTag` does not pass. In a runtime without `AsyncDisposableStack`,
 * nothing does.
 * @since 3.0.0
 * @category Control Abstraction Objects
 * @param value The value to identify.
 * @returns `true` if `value` is a `AsyncDisposableStack`; else, `false`.
 * @example
 * ```ts
 * isAsyncDisposableStack(new AsyncDisposableStack()); // ↪ true
 *
 * isAsyncDisposableStack({}); // ↪ false
 * ```
 */
export function isAsyncDisposableStack(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('AsyncDisposableStack')(value);
}
