// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
//
// Ported to TypeScript from the `has-unicode` package (ISC), by
// Rebecca Turner <https://github.com/iarna/has-unicode>, to drop an
// unmaintained runtime dependency whose CommonJS `require` calls prevented
// @openinf/util-text from being bundled as ESM. Behavior is unchanged.

import * as os from 'node:os';

/** Matches locale charsets that denote UTF-8, e.g. `en_US.UTF-8`. */
const UTF8_CHARSET = /UTF-?8$/i;

/**
 * Detects whether the current terminal can display Unicode characters.
 *
 * Windows is always reported as `false`: modern consoles *can* display
 * Unicode but frequently use a local code page instead, and determining
 * which requires Win32 system calls or shelling out to `chcp`. Callers
 * needing Unicode on Windows should provide their own override.
 * @returns `true` if Unicode is supported; else, `false`.
 */
export function hasUnicode(): boolean {
  if (os.type() === 'Windows_NT') return false;

  const env = process.env;
  // Deliberately `||`, not `??`: an empty `LC_ALL` must fall through to
  // `LC_CTYPE`/`LANG` rather than being treated as a set-but-empty charset.
  const ctype = env['LC_ALL'] || env['LC_CTYPE'] || env['LANG'];
  return UTF8_CHARSET.test(String(ctype));
}
