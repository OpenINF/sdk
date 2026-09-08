// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '../types';

/**
 * Detects whether `value` is
 * [`undefined`](https://mdn.io/Global_Objects/undefined).
 * @since 3.0.0
 * @category Value Properties
 * @param value The value to identify.
 * @returns `true` if `value` is `undefined`; else, `false`.
 * @example ```ts
 * import util from '@openinf/util';
 *
 * util.isUndefined(void 0); // ↪ true
 *
 * util.isUndefined(undefined); // ↪ true
 *
 * util.isUndefined(null); // ↪ false
 * ```
 */
export function isUndefined(value: unknown): value is undefined {
  return value === void 0;
}
(isUndefined as Guard).expectation = 'be of primitive type `undefined`';
