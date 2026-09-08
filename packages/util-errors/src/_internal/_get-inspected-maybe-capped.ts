// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// Adapted from Node.js

import { inspect as utilInspect } from 'node:util';

import { curlyQuote, ellipsify } from '@openinf/util-text';

/**
 * Renders `value` for inclusion in an error message, truncating anything
 * longer than `maxLen`.
 *
 * `util.inspect` wraps strings in quotes, which would be redundant inside a
 * message that already quotes the value. Those are stripped, but only for
 * strings: slicing unconditionally would eat real characters from every other
 * type, rendering `42` as `''` and `true` as `'ru'`.
 * @param value The value to render.
 * @param maxLen The maximum length before the rendering is ellipsified.
 * @returns The quoted, possibly truncated rendering.
 */
export function getInspectedMaybeCapped(
  value: unknown,
  maxLen: number
): string {
  const raw = utilInspect(value, { colors: false });
  let inspected = typeof value === 'string' ? raw.slice(1, -1) : raw;
  if (inspected.length > maxLen) {
    inspected = ellipsify(inspected.slice(0, maxLen));
  }
  return curlyQuote(inspected);
}
