// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { isNullish } from '@openinf/util-core';
import type { Guard } from '@openinf/util-core';

import { isNaN, type NaN as NaNType } from './is-nan';

/**
 * A value that is Falsy.
 */
export type Falsy =
  // oxlint-disable-next-line no-duplicate-type-constituents -- NaNType is a branded number, distinct from the 0/-0 literals.
  false | 0 | -0 | 0n | '' | null | undefined | NaNType;

// TODO: Category?

/**
 * Detects whether `value` is classified as
 * [`Falsy`](https://mdn.io/Glossary/Falsy).
 * @since 3.0.0
 * @category Evaluation
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
 * ```
 */
export function isFalsy(value: unknown): value is Falsy {
  switch (true) {
    case value === false:
      return true;
    case value === 0:
      return true;
    // oxlint-disable-next-line no-compare-neg-zero
    case value === -0:
      return true;
    case value === 0n:
      return true;
    case value === '':
      return true;
    case isNullish(value):
      return true;
    case isNaN(value):
      return true;
    default:
      return false;
  }
}
(isFalsy as Guard).expectation = 'be a falsy value';
