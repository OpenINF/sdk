// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '../types';

/**
 * Detects whether `value` is [`null`](https://mdn.io/Global_Objects/null).
 * @since 3.0.0
 * @category Value Properties
 * @param value The value to identify.
 * @returns `true` if `value` is `null`; else, `false`.
 * @example ```ts
 * import util from '@openinf/util';
 *
 * util.isNull(NaN); // ↪ false
 *
 * util.isNull(undefined); // ↪ false
 *
 * util.isNull(null); // ↪ true
 * ```
 */
export function isNull(value: unknown): boolean {
  return value === null;
}
(isNull as Guard).expectation = 'be of primitive type null';
