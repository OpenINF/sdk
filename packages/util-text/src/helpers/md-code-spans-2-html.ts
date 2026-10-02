// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

interface BacktickRun {
  start: number;
  length: number;
  escaped: boolean;
}

function normalizeCodeSpan(value: string): string {
  let normalized = value.replace(/\r\n?|\n/g, ' ');
  if (
    normalized.startsWith(' ') &&
    normalized.endsWith(' ') &&
    /[^ ]/.test(normalized)
  ) {
    normalized = normalized.slice(1, -1);
  }
  return normalized;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
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

function findBacktickRuns(text: string): BacktickRun[] {
  const runs: BacktickRun[] = [];
  let backslashes = 0;
  for (let i = 0; i < text.length;) {
    const length = backtickRunLength(text, i);
    if (length === 0) {
      backslashes = text.charAt(i) === '\\' ? backslashes + 1 : 0;
      i++;
    } else {
      runs.push({ start: i, length, escaped: backslashes % 2 !== 0 });
      backslashes = 0;
      i += length;
    }
  }
  return runs;
}

function findMatchingRuns(runs: readonly BacktickRun[]): number[] {
  const nextByLength = new Map<number, number>();
  const matches = Array.from<number>({ length: runs.length }).fill(-1);

  for (let i = runs.length - 1; i >= 0; i--) {
    const run = runs.at(i);
    if (run === undefined) {
      continue;
    }
    // An escaped first backtick stays literal outside a span. Any remaining
    // backticks can open one, but a closing run always uses its full length:
    // backslashes inside code spans are ordinary code text.
    const next = nextByLength.get(run.length - Number(run.escaped));
    if (next !== undefined) {
      matches[i] = next;
    }
    nextByLength.set(run.length, i);
  }
  return matches;
}

/**
 * Processes the supplied string by transforming any Markdown backtick code
 * spans (beginning and ending with a matching run of backticks) into HTML
 * code elements.
 *
 * Opening delimiters respect backslash escapes. Text outside the spans is
 * preserved, including the escape backslashes themselves.
 *
 * Backtick runs and their next equal-length run are indexed before rendering,
 * keeping unmatched fence patterns linear instead of repeatedly scanning the
 * remaining input.
 * @category Text Processing
 * @param text The Markdown text to process.
 * @returns The processed text.
 */
export function mdCodeSpans2html(text: string): string {
  const runs = findBacktickRuns(text);
  const matches = findMatchingRuns(runs);
  let out = '';
  let cursor = 0;
  let runIndex = 0;

  while (runIndex < runs.length) {
    const closeIndex = matches.at(runIndex);
    if (closeIndex === undefined || closeIndex === -1) {
      runIndex++;
      continue;
    }

    const open = runs.at(runIndex);
    const close = runs.at(closeIndex);
    if (open === undefined || close === undefined) {
      break;
    }
    const content = text.slice(open.start + open.length, close.start);

    out += text.slice(cursor, open.start + Number(open.escaped));
    out += `<code>${escapeHtml(normalizeCodeSpan(content))}</code>`;
    cursor = close.start + close.length;
    runIndex = closeIndex + 1;
  }

  return out + text.slice(cursor);
}
