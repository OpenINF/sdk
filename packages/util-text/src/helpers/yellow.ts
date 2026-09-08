// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { yellow as yellowSgr } from '../_internal/ansi';
import { supportsAnsi } from '../_internal/supports-ansi';

/**
 * Returns the supplied string as yellow colored if ANSI escapes are supported.
 * @param text The string to colorize.
 * @returns The yellow colored string, or `text` unchanged.
 */
export function yellow(text: string): string {
  return supportsAnsi() ? yellowSgr(text) : text;
}
