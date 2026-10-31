// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

// A plain object rather than a TypeScript enum. An enum compiles to quoted
// writes (`UnicodeEscapes["ellipsis"] = ...`) read back unquoted, and a
// minifier that renames properties, such as Closure Compiler's ADVANCED mode,
// renames only the reads, which then find nothing.
/**
 * The Unicode characters the text helpers print, such as the curly quotes
 * `curlyQuote` wraps a string in.
 * @category Text Processing
 * @see https://console.spec.whatwg.org/#assert
 * @see https://developer.mozilla.org/en-US/docs/Tools/Web_Console/Console_messages
 */
export const UnicodeEscapes = {
  infoSymbol: 'ⓘ',
  midlineEllipsis: '⋯',
  ellipsis: '…',
  errorSymbol: 'ⓧ',
  leftDoubleQuotes: '“',
  rightDoubleQuotes: '”',
  warningSymbol: '⚠',
} as const;

/**
 * One of the characters in {@link UnicodeEscapes}.
 * @category Text Processing
 */
export type UnicodeEscapes =
  (typeof UnicodeEscapes)[keyof typeof UnicodeEscapes];
