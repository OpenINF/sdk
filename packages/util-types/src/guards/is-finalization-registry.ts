// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Missing from Node.js

import { _tagTester, isObjectLike } from '@openinf/util-core';

/**
 * Detects whether `value` is
 * a [`FinalizationRegistry`](https://mdn.io/Global_Objects/FinalizationRegistry), which asks to be told when a value is collected, section 26.2 of the specification.
 *
 * The check asks for the internal slots only `FinalizationRegistry` gives an object,
 * through a probe that leaves the value as it found it, so an object carrying
 * `Symbol.toStringTag` does not pass. In a runtime without `FinalizationRegistry`,
 * nothing does.
 * @since 3.0.0
 * @category Managing Memory
 * @param value The value to identify.
 * @returns `true` if `value` is a `FinalizationRegistry`; else, `false`.
 * @example
 * ```ts
 * isFinalizationRegistry(new FinalizationRegistry(() => {})); // ↪ true
 *
 * isFinalizationRegistry({}); // ↪ false
 * ```
 */
export function isFinalizationRegistry(value: unknown): boolean {
  return isObjectLike(value) && _tagTester('FinalizationRegistry')(value);
}
