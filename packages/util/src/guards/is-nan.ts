// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard, Tagged } from '@openinf/util-core';

/**
 * A NaN value.
 */
// oxlint-disable-next-line no-shadow-restricted-names -- type/value namespaces are distinct; `typeof NaN` refers to the global value.
export type NaN = Tagged<typeof NaN, '__NaN__'>;

/**
 * Detects whether `value` is [`NaN`](https://mdn.io/Global_Objects/NaN).
 *
 * **Note:** This function is based on
 * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
 * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
 * `undefined` and other non-number values.
 * @since 3.0.0
 * @category Numbers and Dates
 * @param value The value to identify.
 * @returns `true` if `value` is `NaN`; else, `false`.
 * @example ```ts
 * import util from '@openinf/util';
 *
 * util.isNaN(NaN); // ↪ true
 *
 * util.isNaN(new Number(NaN)); // ↪ true
 *
 * util.isNaN(undefined); // ↪ false
 * ```
 */
export function isNaN(value: unknown): value is NaN {
  // The `NaN` primitive is the only value that is not equal to itself.
  return value !== value;
}
(isNaN as Guard).expectation = 'be NaN';
