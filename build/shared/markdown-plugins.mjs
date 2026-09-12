/**
 * @file The remark plugins this repository lints Markdown with.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/markdown-plugins
 */

import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkLintFencedCodeFlag from 'remark-lint-fenced-code-flag';
import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import remarkPresetPrettier from 'remark-preset-prettier';
import remarkValidateLinks from 'remark-validate-links';

/**
 * The languages a fenced code block may be tagged with.
 *
 * The portal highlights a block by this flag and holds its own pages to the
 * same set, so one it does not know is one it cannot style. `ts` rather than
 * `typescript` because the generated reference inherits `js` fences from
 * declarations this repository does not write, and the short forms read as a
 * pair; the portal's own allowlist accepts both.
 */
const INFO_STRINGS = ['bash', 'console', 'diff', 'json', 'text', 'ts', 'yaml'];

/**
 * Rules that read a fragment as well as they read a document.
 *
 * A JSDoc `@example` is a few lines of Markdown, not a page: it has no title,
 * it defines no link references, and it starts at whatever heading depth its
 * symbol sits at. Rules that judge a document as a whole would fail every one
 * of them for being what they are, so the fragment pass runs only the rules
 * that look at a block on its own terms.
 * @type {import('unified').PluggableList}
 */
export const fragmentPlugins = [
  remarkGfm,
  [remarkLintFencedCodeFlag, { allowEmpty: false, flags: INFO_STRINGS }],
];

/**
 * Everything the fragment pass runs, plus what only a whole file can answer
 * for: its heading structure, its link references, and the relative links and
 * heading anchors that `remark-validate-links` resolves against the files
 * beside it.
 *
 * `remark-preset-prettier` comes last and turns off the rules that would argue
 * with the formatter, which owns whitespace here.
 *
 * A preset goes in on its own rather than in a `[plugin, options]` pair: it is
 * a list of plugins, not one of them, and unified calls the first element of a
 * pair. The command line tolerates the pair and a processor built by hand
 * throws on it, so the two passes would have disagreed about the same list.
 * @param {{links?: boolean}} [options] Whether to resolve links, which only
 *   makes sense where a relative path means what it says.
 * @returns {import('unified').PluggableList} The plugins, in order.
 */
export function documentPlugins({ links = true } = {}) {
  /** @type {import('unified').PluggableList} */
  const linkChecking = [[remarkValidateLinks, {}]];

  return [
    [remarkFrontmatter, ['yaml']],
    ...fragmentPlugins,
    remarkPresetLintRecommended,
    remarkPresetLintConsistent,
    ...(links ? linkChecking : []),
    // Its own declaration says this list may hold `undefined`, which unified's
    // `Preset` does not allow. The value never does; the type is loose.
    /** @type {import('unified').Preset} */ (remarkPresetPrettier),
  ];
}
