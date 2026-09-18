// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is
 * a [`DisposableStack`](https://mdn.io/Global_Objects/DisposableStack), which disposes of what it holds in reverse order, section 27.3 of the specification.
 *
 * The check asks for the internal slots only `DisposableStack` gives an object,
 * through a probe that leaves the value as it found it, so an object carrying
 * `Symbol.toStringTag` does not pass. In a runtime without `DisposableStack`,
 * nothing does.
 * @since 3.0.0
 * @category Control Abstraction Objects
 * @param value The value to identify.
 * @returns `true` if `value` is a `DisposableStack`; else, `false`.
 * @example
 * ```ts
 * isDisposableStack(new DisposableStack()); // ↪ true
 *
 * isDisposableStack({}); // ↪ false
 * ```
 */
export function isDisposableStack(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('DisposableStack')(value);
}
