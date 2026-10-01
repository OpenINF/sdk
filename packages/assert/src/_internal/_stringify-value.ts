// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { inspectValue } from '../helpers/inspect-value';

/**
 * Describes a value for an assertion message. `String` is tried first, then
 * JSON for an object it reports only as `[object Object]`. A value `String`
 * cannot convert, such as an object without a prototype or one whose
 * `toString` throws, is described by `inspectValue` instead, so describing a
 * value never throws in place of the assertion it is describing.
 * @private
 * @param value The value to describe.
 * @returns The description.
 */
export function _stringifyValue(value: unknown): string {
  try {
    const stringValue = String(value);
    if (stringValue !== '[object Object]') return stringValue;

    const jsonValue = JSON.stringify(value);
    return typeof jsonValue === 'string' ? jsonValue : stringValue;
  } catch {
    try {
      return inspectValue(value);
    } catch {
      return '<unavailable value>';
    }
  }
}
