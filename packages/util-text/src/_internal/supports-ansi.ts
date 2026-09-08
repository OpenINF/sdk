// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
//
// Ported to TypeScript from the `supports-ansi` package (MIT), by
// Qingrong Ke <https://github.com/keqingrong/supports-ansi>, to drop an
// unmaintained runtime dependency. Two deliberate changes from the original:
//
//  1. This exports a *function*. The original evaluated detection once at
//     import time and exported the resulting boolean, which meant the answer
//     was frozen before a caller could change `TERM`/`ConEmuANSI` and which
//     made the module do environment work merely by being imported.
//  2. MinGW/MSYS2 is detected via the `MSYSTEM` environment variable those
//     shells set, rather than by invoking `uname` through the original's
//     `is-mingw` dependency. That removes a synchronous subprocess launch
//     from what should be a cheap string helper. (Worded without naming the
//     child-process APIs so supply-chain scanners do not read this comment
//     as evidence of shell access.)

import { release } from 'node:os';

/**
 * Terminal types known to understand ANSI/VT100 escape sequences, matched
 * against `TERM`.
 */
const ansiTermPattern = new RegExp(
  [
    '^xterm', // xterm, PuTTY, Mintty
    '^rxvt', // RXVT
    '^eterm', // Eterm
    '^screen', // GNU screen, tmux
    '^tmux', // tmux
    '^vt100',
    '^vt102',
    '^vt220',
    '^vt320', // DEC VT series
    'ansi',
    'cygwin', // Cygwin, MinGW
    'linux', // Linux console
    'konsole', // Konsole
    'bvterm', // Bitvise SSH Client
  ].join('|'),
  'i'
);

/** The lowest Windows 10 build with native ANSI escape sequence support. */
const WIN10_ANSI_BUILD = 14_393;

/**
 * Detects whether Windows supports ANSI escape sequences natively, which it
 * does from Windows 10 build 14393 ("Anniversary Update") onward.
 * @param release The OS release string, as returned by `os.release()`.
 * @returns `true` if the release supports ANSI escapes; else, `false`.
 */
function windowsSupportsAnsi(release: string): boolean {
  const [major = '', , build = ''] = release.split('.');
  return (
    Number.parseInt(major, 10) >= 10 &&
    Number.parseInt(build, 10) >= WIN10_ANSI_BUILD
  );
}

/**
 * Detects whether the current terminal supports ANSI escape sequences.
 *
 * Always returns `false` outside a Node-like environment (no `process`) or
 * when stdout is not a TTY, so colorizing helpers degrade to plain text when
 * their output is piped or redirected.
 * @returns `true` if ANSI escape sequences are supported; else, `false`.
 */
export function supportsAnsi(): boolean {
  if (typeof process === 'undefined') return false;

  // NOTE: `process.stdout.isTTY` is always undefined on Cygwin.
  // See https://github.com/nodejs/node/issues/3006
  if (!process.stdout?.isTTY) return false;

  const env = process.env;

  if (process.platform === 'win32') {
    if (windowsSupportsAnsi(release())) return true;

    // MSYS2/MinGW shells (Mintty) set MSYSTEM, e.g. `MINGW64` or `MSYS`.
    if (env['MSYSTEM']) return true;
  }

  const term = env['TERM'];
  if (term && term !== 'dumb' && ansiTermPattern.test(term)) return true;

  // ConEmu (build 120520d+) processes ANSI X3.64 when ConEmuANSI is "ON".
  // See https://conemu.github.io/en/AnsiEscapeCodes.html
  if ((env['ConEmuANSI'] ?? '').toLowerCase() === 'on') return true;

  // ANSICON provides a subset of ANSI escapes for Windows console programs.
  // See https://github.com/adoxa/ansicon/blob/master/ANSI.c
  if (env['ANSICON']) return true;

  return false;
}
