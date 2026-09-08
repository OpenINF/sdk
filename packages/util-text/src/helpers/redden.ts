// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { red } from '../_internal/ansi';
import { supportsAnsi } from '../_internal/supports-ansi';

/**
 * Returns the supplied string as red colored if ANSI escapes are supported.
 * @param text The string to colorize.
 * @returns The red colored string, or `text` unchanged.
 */
export function redden(text: string): string {
  return supportsAnsi() ? red(text) : text;
}
