/**
 * @file The API reference's categories, and how a doc comment is read for one.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} tools/api-categories
 */

// Kept apart from the checker so the rules can be tested without walking the
// repository. Everything here reads a tag the way TypeScript parses it, which
// is the way TypeDoc does: the value is the tag's whole comment, and that
// comment may start on the line after `@category` rather than beside it.
import ts from 'typescript';

/**
 * The categories, each with the part of ECMA-262 it is taken from, as numbered
 * in the current draft. Keep this in step with the list in CONTRIBUTING.md.
 */
export const CATEGORIES: ReadonlyMap<string, string> = new Map([
  ['Hosts and Implementations', '4.2 Hosts and Implementations'],
  ['Data Types and Values', '6 ECMAScript Data Types and Values'],
  ['Type Conversion', '7.1 Type Conversion'],
  [
    'Testing and Comparison Operations',
    '7.2 Testing and Comparison Operations',
  ],
  ['Exotic Objects', '10.4 Built-in Exotic Object Internal Methods and Slots'],
  ['Fundamental Objects', '20 Fundamental Objects'],
  ['Numbers and Dates', '21 Numbers and Dates'],
  ['Text Processing', '22 Text Processing'],
  ['Indexed Collections', '23 Indexed Collections'],
  ['Keyed Collections', '24 Keyed Collections'],
  ['Structured Data', '25 Structured Data'],
  ['Managing Memory', '26 Managing Memory'],
  ['Control Abstraction Objects', '27 Control Abstraction Objects'],
  ['Reflection', '28 Reflection'],
]);

/** One `@category` tag, with the value TypeScript parsed for it. */
export interface CategoryTag {
  /** The tag's comment, trimmed. Empty when the tag has none. */
  value: string;
  /** The 1-based line the tag name is on. */
  line: number;
}

function toTag(tag: ts.JSDocTag, source: ts.SourceFile): CategoryTag {
  return {
    value: ts.getTextOfJSDocComment(tag.comment)?.trim() ?? '',
    line:
      source.getLineAndCharacterOfPosition(tag.tagName.getStart(source)).line +
      1,
  };
}

function isCategory(tag: ts.JSDocTag): boolean {
  return tag.tagName.text === 'category';
}

/**
 * Every `@category` tag in a file, on any declaration, exported or not. A tag
 * reachable from two nodes, such as a variable statement and the declaration
 * inside it, is listed once.
 * @param source The parsed file.
 * @returns The tags, in the order they appear.
 */
export function categoryTagsIn(source: ts.SourceFile): CategoryTag[] {
  const found = new Map<number, CategoryTag>();

  const visit = (node: ts.Node) => {
    for (const tag of ts.getJSDocTags(node)) {
      if (isCategory(tag) && !found.has(tag.pos)) {
        found.set(tag.pos, toTag(tag, source));
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return [...found.values()].sort((one, other) => one.line - other.line);
}

/**
 * What is wrong with a category value, if anything.
 * @param value A tag's parsed value.
 * @returns A description of the problem, or `undefined` for a category on the
 * list.
 */
export function categoryProblem(value: string): string | undefined {
  if (value === '') {
    return '@category has no value, so TypeDoc drops it and lists the export under "Other"';
  }
  if (!CATEGORIES.has(value)) {
    return `"${value}" is not a category; use one of the list in tools/api-categories.mts`;
  }
  return undefined;
}

/**
 * How a published export is categorized, judged across its declarations.
 * `invalid` means it carries a tag, but none TypeDoc will file it under
 * correctly; that tag is reported where it is written.
 * @param declarations The export's declarations.
 * @returns `valid`, `invalid`, or `missing`.
 */
export function categoryStateOf(
  declarations: readonly ts.Declaration[]
): 'valid' | 'invalid' | 'missing' {
  const values = declarations.flatMap((declaration) => {
    const source = declaration.getSourceFile();
    return ts
      .getJSDocTags(declaration)
      .filter(isCategory)
      .map((tag) => toTag(tag, source).value);
  });

  if (values.some((value) => categoryProblem(value) === undefined)) {
    return 'valid';
  }
  return values.length > 0 ? 'invalid' : 'missing';
}
