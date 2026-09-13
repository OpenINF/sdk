/**
 * @file Lint the Markdown inside JSDoc comments, with the Markdown linter.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} tools/check-jsdoc-markdown
 */

// A doc comment is Markdown. TypeDoc renders it into the API reference the
// portal publishes, so a fence in an `@example` becomes a highlighted block on
// a page exactly as one in a README does. `remark` never sees it, though,
// because it lives in a `.ts` file behind a column of asterisks.
//
// So the asterisks come off and what is left goes through the same processor,
// with the rules that read a fragment rather than a document. Positions come
// back in the stripped text and are mapped to the line in the source, which is
// the file somebody can actually edit.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { remark } from 'remark';

import { fragmentPlugins } from '../build/shared/markdown-plugins.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** A whole JSDoc comment, which is the unit TypeDoc renders. */
const DOC_COMMENT = /\/\*\*[\s\S]*?\*\//g;

/** The asterisk column, and the single space after it that is not content. */
const ASTERISK = /^[ \t]*\*[ ]?/;

/** The delimiter that ends a comment, wherever on its last line it sits. */
const CLOSING = /\s*\*\/\s*$/;

/** Every TypeScript source whose comments become pages. */
function sources(): string[] {
  const found: string[] = [];
  const walk = (directory: string) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);

      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.ts')) found.push(full);
    }
  };

  for (const entry of fs.readdirSync(path.join(ROOT, 'packages'), {
    withFileTypes: true,
  })) {
    const src = path.join(ROOT, 'packages', entry.name, 'src');

    if (entry.isDirectory() && fs.existsSync(src)) walk(src);
  }

  return found;
}

/**
 * The Markdown inside one doc comment, and where each of its lines came from.
 * @param comment The comment, asterisks and delimiters included.
 * @param first The 1-based line the comment starts on.
 * @returns The text, and the source line each of its lines came from.
 */
function undress(comment: string, first: number) {
  const markdown: string[] = [];
  const lines: number[] = [];
  const all = comment.split('\n');

  for (const [index, line] of all.entries()) {
    // The `/**` line carries no content of its own.
    if (index === 0) continue;

    // `*/` closes the comment wherever it sits, and TypeDoc drops it before
    // rendering what is left. Written at the end of a line that also closes a
    // fence -- ``` */ -- it would otherwise stay in the text, where it stops
    // being a closing fence and the block swallows the rest. Our reading of
    // the comment has to be TypeDoc's reading of it.
    const content =
      index === all.length - 1
        ? line.replace(ASTERISK, '').replace(CLOSING, '')
        : line.replace(ASTERISK, '');

    // Which leaves nothing at all when `*/` was the whole line.
    if (index === all.length - 1 && content === '') continue;

    markdown.push(content);
    lines.push(first + index);
  }

  return { markdown: markdown.join('\n'), lines };
}

const processor = remark().use(fragmentPlugins).freeze();

/** As much of a syntax tree node as counting fences needs to know. */
type MarkdownNode = { type: string; children?: MarkdownNode[] };

/**
 * How many fenced blocks a parsed document holds, at any depth.
 *
 * Counting these rather than the comments that looked like they held one is
 * what makes the guard at the end mean something: a comment that merely says
 * the word ``` in prose is not a fence, and if extraction broke tomorrow such
 * a comment would be the only thing keeping the count above zero.
 * @param node The tree, or any node in it.
 * @returns The number of `code` nodes at or below it.
 */
function fences(node: MarkdownNode): number {
  if (node.type === 'code') return 1;

  return (node.children ?? []).reduce(
    (total, child) => total + fences(child),
    0
  );
}

const problems: string[] = [];
let fencesFound = 0;

for (const file of sources()) {
  const text = fs.readFileSync(file, 'utf8');

  for (const found of text.matchAll(DOC_COMMENT)) {
    const before = text.slice(0, found.index);
    const first = before.split('\n').length;
    const { markdown, lines } = undress(found[0], first);

    // Most comments are a sentence and some tags. Skipping those without a
    // fence character anywhere is a cheap way not to parse them; whether one
    // actually holds a fence is remark's answer, below.
    if (!markdown.includes('```') && !markdown.includes('~~~')) continue;

    const tree = processor.parse(markdown);

    fencesFound += fences(tree);

    const report = processor.processSync(markdown);

    for (const message of report.messages) {
      const line = lines[(message.line ?? 1) - 1] ?? first;
      const where = `${path.relative(ROOT, file)}:${line}`;

      problems.push(`${where}: ${message.reason}`);
    }
  }
}

if (problems.length > 0) {
  console.error(
    `Markdown in a doc comment that the portal could not render:\n\n${problems
      .map((problem) => `  ${problem}`)
      .join('\n')}\n`
  );
  process.exit(1);
}

// A comment that stopped matching would leave this reporting success over
// nothing at all, which is the failure mode a checker is worst at noticing.
if (fencesFound === 0) {
  console.error(
    'No fenced code found in any doc comment, which cannot be right.'
  );
  process.exit(1);
}

console.info(`Checked ${fencesFound} fenced code blocks in doc comments.`);
