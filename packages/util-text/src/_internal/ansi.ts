// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
//
// Minimal SGR (Select Graphic Rendition) helpers, replacing the `cli-color`
// dependency. Only the five styles this package actually exposes are
// implemented; `cli-color` pulled in a 14-package CommonJS tree (`es5-ext`,
// `memoizee`, `es6-symbol`, ...) whose dynamic `require` calls made
// @openinf/util-text impossible to bundle as ESM without a `createRequire`
// shim.
//
// Nesting behavior is byte-compatible with `cli-color`, including its
// asymmetry between colors and formats (see `colorize` and `format` below).
// test/_internal/ansi.ts pins the exact sequences.

/** The ASCII escape character that introduces every SGR sequence. */
const ESC = '\u001B';

/** Restores the default foreground color. Shared by every color style. */
const FOREGROUND_RESET = `${ESC}[39m`;

/**
 * Applies a foreground color to `text`.
 *
 * Any foreground reset already inside `text` is rewritten to this color's
 * opening code, so a nested color resumes the outer one when it ends rather
 * than dropping back to the terminal default.
 * @param text The string to colorize.
 * @param code The SGR parameter for the desired color.
 * @returns The colorized string.
 */
function colorize(text: string, code: number): string {
  const open = `${ESC}[${code}m`;
  return `${open}${text.split(FOREGROUND_RESET).join(open)}${FOREGROUND_RESET}`;
}

/**
 * Applies a non-color format (italic, underline, ...) to `text`.
 *
 * Unlike colors, a nested closing code is *removed* rather than reopened:
 * the outer format is still in effect, so emitting nothing keeps it on while
 * emitting the close would end it early. This matches `cli-color`, which
 * reopens only its `_fg`/`_bg` modes.
 * @param text The string to style.
 * @param openCode The SGR parameter that begins the format.
 * @param closeCode The SGR parameter that ends the format.
 * @returns The styled string.
 */
function format(text: string, openCode: number, closeCode: number): string {
  const open = `${ESC}[${openCode}m`;
  const close = `${ESC}[${closeCode}m`;
  return `${open}${text.split(close).join('')}${close}`;
}

/**
 * Colors `text` blue.
 * @param text The string to colorize.
 * @returns The blue colored string.
 */
export function blue(text: string): string {
  return colorize(text, 34);
}

/**
 * Colors `text` red.
 * @param text The string to colorize.
 * @returns The red colored string.
 */
export function red(text: string): string {
  return colorize(text, 31);
}

/**
 * Colors `text` yellow.
 * @param text The string to colorize.
 * @returns The yellow colored string.
 */
export function yellow(text: string): string {
  return colorize(text, 33);
}

/**
 * Renders `text` italic.
 * @param text The string to style.
 * @returns The italicized string.
 */
export function italic(text: string): string {
  return format(text, 3, 23);
}

/**
 * Renders `text` underlined.
 * @param text The string to style.
 * @returns The underlined string.
 */
export function underline(text: string): string {
  return format(text, 4, 24);
}
