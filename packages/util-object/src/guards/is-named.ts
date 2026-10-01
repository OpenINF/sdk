// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';

/**
 * An object that is named.
 * @category Fundamental Objects
 */
export interface Named {
  name: string;
}

/**
 * Detects whether `value` is an object, other than a function, with a `name`
 * property of type `string`, its own or inherited.
 * @since 3.0.0
 * @category Fundamental Objects
 * @param value The value to identify.
 * @returns `true` if `value` is a named object; else, `false`.
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
