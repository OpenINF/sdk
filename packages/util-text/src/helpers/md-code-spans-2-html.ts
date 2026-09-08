// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

/**
 * Strips only spaces, not tabs or newlines, as the original trim did.
 * @param value The string to trim.
 * @returns The string without leading or trailing spaces.
 */
function trimSpaces(value: string): string {
  let start = 0;
  let end = value.length;
  while (start < end && value.charAt(start) === ' ') start++;
  while (end > start && value.charAt(end - 1) === ' ') end--;
  return value.slice(start, end);
}

/**
 * Measures the backtick run beginning at `index`.
 * @param text The string being scanned.
 * @param index The position to measure from.
 * @returns The run's length, or 0 if `text` has no backtick at `index`.
 */
function backtickRunLength(text: string, index: number): number {
  let i = index;
  while (i < text.length && text.charAt(i) === '`') i++;
  return i - index;
}

/**
 * Processes the supplied string by transforming any Markdown backtick code
 * spans (beginning and ending with a matching run of backticks) into HTML
 * code elements.
 *
 * Implemented as a single left-to-right scan rather than a regular
 * expression. The previous pattern combined a lazy quantifier with a
 * backreference, which made the matcher backtrack quadratically: input of `n`
 * backticks followed by `n` other characters took time proportional to `n²`,
 * about 20 seconds at 80 KB and far worse beyond that. Untrusted Markdown
 * could stall the event loop with a single call. This scan is linear.
 * @param text The Markdown text to process.
 * @returns The processed text.
 */
export function mdCodeSpans2html(text: string): string {
  let out = '';
  let i = 0;

  while (i < text.length) {
    const openLength = backtickRunLength(text, i);

    if (openLength === 0) {
      out += text.charAt(i);
      i++;
      continue;
    }

    const contentStart = i + openLength;

    // Find the next run of backticks of exactly the same length; a longer or
    // shorter run cannot close this span, matching the old backreference plus
    // its negative lookahead.
    let closeStart = -1;
    let scan = contentStart;
    while (scan < text.length) {
      const runLength = backtickRunLength(text, scan);
      if (runLength === 0) {
        scan++;
      } else if (runLength === openLength) {
        closeStart = scan;
        break;
      } else {
        scan += runLength;
      }
    }

    const content =
      closeStart === -1 ? '' : text.slice(contentStart, closeStart);

    // The old pattern required at least one character of content, and that it
    // neither began nor ended with a backtick.
    const isSpan =
      closeStart !== -1 &&
      content.length > 0 &&
      !content.startsWith('`') &&
      !content.endsWith('`');

    if (!isSpan) {
      out += text.slice(i, contentStart);
      i = contentStart;
      continue;
    }

    out += `<code>${trimSpaces(content)}</code>`;
    i = closeStart + openLength;
  }

  return out;
}
