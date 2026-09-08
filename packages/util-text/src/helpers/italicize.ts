// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { italic } from '../_internal/ansi';
import { supportsAnsi } from '../_internal/supports-ansi';

/**
 * Returns the supplied string as italicized if ANSI escapes are supported.
 * @param text The string to italicize.
 * @returns The italicized string, or `text` unchanged.
 */
export function italicize(text: string): string {
  return supportsAnsi() ? italic(text) : text;
}
