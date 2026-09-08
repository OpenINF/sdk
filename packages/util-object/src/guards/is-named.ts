// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

/**
 * An object that is named.
 */
export interface Named {
  name: string;
}

/**
 * Detects whether `value` has a `name` property of type `string`.
 * @since 3.0.0
 * @category Exotic Objects
 * @param value The value to identify.
 * @returns `true` if `value` is an `Array`; else, `false`.
 * @example
 * isNamed({ name: 'Derek' }); // ↪ true
 *
 * isNamed({ name: 1000 }); // ↪ false
 *
 * isNamed({ name: undefined }); // ↪ false
 */
export function isNamed(value: unknown): value is Named {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof (value as Named).name === 'string'
  );
}
(isNamed as Guard).expectation = 'be named';
