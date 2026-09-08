// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '../types';

/**
 * A value that is [nullish](https://mdn.io/Glossary/Nullish).
 */
export type Nullish = null | undefined;

/**
 * Detects whether `value` evaluates to either
 * [`null`](https://mdn.io/Global_Objects/null) or
 * [`undefined`](https://mdn.io/Global_Objects/undefined).
 * @since 3.0.0
 * @category Value Properties
 * @param value The value to identify.
 * @returns `true` if `value` is nullish; else, `false`.
 * @example ```ts
 * import util from '@openinf/util';
 *
 * util.isNullish(null); // ↪ true
 *
 * util.isNullish(void 0); // ↪ true
 *
 * util.isNullish(NaN); // ↪ false
 * ```
 */
export function isNullish(value: unknown): value is Nullish {
  return value === null || value === undefined;
}
(isNullish as Guard).expectation = 'be a nullish value';
