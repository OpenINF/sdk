// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { hasUnicode } from '../_internal/has-unicode';
import { UnicodeEscapes } from '../types';

/**
 * Returns the supplied string as ellipsified if Unicode is supported.
 * @param text The string to ellipsify.
 * @returns The ellipsified string.
 */
export function ellipsify(text: string): string {
  return `${text}${hasUnicode() ? UnicodeEscapes.ellipsis : '...'}`;
}
