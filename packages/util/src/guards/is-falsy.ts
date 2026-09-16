// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import type { Guard } from '@openinf/util-core';
import { type NaN as NaNType } from '@openinf/util-number';

/**
 * A value that is Falsy.
 *
 * The type cannot name every one. An object whose `[[IsHTMLDDA]]` internal
 * slot is present, which in a browser is `document.all`, is falsy too, and no
 * type describes it.
 * @category Type Conversion
 */
export type Falsy =
  // oxlint-disable-next-line no-duplicate-type-constituents -- NaNType is a branded number, distinct from the 0/-0 literals.
  false | 0 | -0 | 0n | '' | null | undefined | NaNType;

/**
 * Detects whether `value` is classified as
 * [`Falsy`](https://mdn.io/Glossary/Falsy).
 * @since 3.0.0
 * @category Type Conversion
 * @param value The value to identify.
 * @returns `true` if `value` is falsy; else, `false`.
 * @example
 * ```ts
 * import util from '@openinf/util';
 *
 * util.isFalsy(false); // ↪ true
 *
 * util.isFalsy(''); // ↪ true
 *
 * util.isFalsy(new Boolean()); // ↪ false
 *
 * util.isFalsy(Number.NaN); // ↪ true
 * ```
 */
export function isFalsy(value: unknown): boolean {
  // ToBoolean, section 7.1.2, is what `!` performs, and it is the whole
  // definition: false, +0, -0, NaN, the empty string, 0n, undefined and null
  // are falsy, and so is an object with an [[IsHTMLDDA]] internal slot, which
  // Annex B.3.6 gives to `document.all`. Listing the values instead would miss
  // that one, since nothing about it is observable except this.
  return !value;
}
(isFalsy as Guard).expectation = 'be a falsy value';
