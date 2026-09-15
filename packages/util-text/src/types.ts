// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * The Unicode characters the text helpers print, such as the curly quotes
 * `curlyQuote` wraps a string in.
 * @category Text Processing
 * @see https://console.spec.whatwg.org/#assert
 * @see https://developer.mozilla.org/en-US/docs/Tools/Web_Console/Console_messages
 */
export enum UnicodeEscapes {
  infoSymbol = 'ⓘ', // ⓘ
  midlineEllipsis = '⋯', // ⋯
  ellipsis = '…', // …
  errorSymbol = 'ⓧ', // ⓧ
  leftDoubleQuotes = '“', // “
  rightDoubleQuotes = '”', // ”
  warningSymbol = '⚠', // ⚠
}
