// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { blue } from '../_internal/ansi';
import { supportsAnsi } from '../_internal/supports-ansi';

/**
 * Returns the supplied string as blue colored if ANSI escapes are supported.
 * @param text The string to colorize.
 * @returns The blue colored string, or `text` unchanged.
 */
export function blueify(text: string): string {
  return supportsAnsi() ? blue(text) : text;
}
