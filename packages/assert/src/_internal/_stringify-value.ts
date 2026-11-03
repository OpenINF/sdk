// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { inspectValue } from '../helpers/inspect-value';
import { _exceedsDisplayBudget } from './_exceeds-display-budget';

/**
 * Describes a value for an assertion message. `String` is tried first, then
 * JSON for an object it reports only as `[object Object]`. A value `String`
 * cannot convert, such as an object without a prototype or one whose
 * `toString` throws, is described by `inspectValue` instead, so describing a
 * value never throws in place of the assertion it is describing. An object
 * too big to show in full goes straight to `inspectValue`, which shows its
 * top level only: `String` of nested arrays and `JSON.stringify` both repeat
 * a shared object wherever it is reached. So does one with an enumerable
 * getter, which both of them would run, and which could answer with anything.
 * @private
 * @param value The value to describe.
 * @returns The description.
 */
export function _stringifyValue(value: unknown): string {
  if (
    typeof value === 'object' &&
    _exceedsDisplayBudget(value, undefined, true)
  ) {
    try {
      return inspectValue(value, true);
    } catch {
      return '<unavailable value>';
    }
  }
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
