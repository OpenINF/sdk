// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import { hasUnicode } from '../_internal/has-unicode';
import { UnicodeEscapes } from '../types';

/**
 * Returns the supplied string as curly quoted if Unicode is supported.
 * @category Text Processing
 * @param text The string to quote.
 * @returns `text` in curly double quotes, or in straight ones where Unicode
 * is not supported.
 */
export function curlyQuote(text: string): string {
  // Detected once: both quotes answer the same question, and `hasUnicode`
  // re-reads the environment and runs a regex on every call.
  const unicode = hasUnicode();
  const leftQuote = unicode ? UnicodeEscapes.leftDoubleQuotes : '"';
  const rightQuote = unicode ? UnicodeEscapes.rightDoubleQuotes : '"';
  return `${leftQuote}${text}${rightQuote}`;
}
