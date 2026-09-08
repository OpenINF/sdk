// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { underline as underlineSgr } from '../_internal/ansi';
import { supportsAnsi } from '../_internal/supports-ansi';

/**
 * Returns the supplied string as underlined if ANSI escapes are supported.
 * @param text The string to underline.
 * @returns The underlined string, or `text` unchanged.
 */
export function underline(text: string): string {
  return supportsAnsi() ? underlineSgr(text) : text;
}
