/**
 * @file Tests for how doc comments are read for API reference categories.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} tools/api-categories.test
 */
import { deepStrictEqual, match, strictEqual } from 'node:assert/strict';
import { describe, test } from 'node:test';

import ts from 'typescript';

import {
  categoryProblem,
  categoryStateOf,
  categoryTagsIn,
} from './api-categories.mts';

function parse(text: string): ts.SourceFile {
  return ts.createSourceFile('fixture.ts', text, ts.ScriptTarget.Latest, true);
}

/** The function a fixture declares, as the checker would pass it. */
function declarationsOf(text: string): ts.Declaration[] {
  return parse(text).statements.filter(ts.isFunctionDeclaration);
}

/** Every problem reported for the tags in a file. */
function problemsIn(text: string): string[] {
  return categoryTagsIn(parse(text)).flatMap((tag) => {
    const problem = categoryProblem(tag.value);
    return problem ? [`${tag.line}: ${problem}`] : [];
  });
}

const VALID = `/**
 * Detects a thing.
 * @category Text Processing
 */
export function isThing(value: unknown): boolean {
  return value === 'thing';
}
`;

const BARE = `/**
 * Detects a thing.
 * @category
 * @param value The value.
 */
export function isThing(value: unknown): boolean {
  return value === 'thing';
}
`;

const MULTILINE_INVALID = `/**
 * Detects a thing.
 * @category
 * Made Up
 */
export function isThing(value: unknown): boolean {
  return value === 'thing';
}
`;

const MISSING = `/**
 * Detects a thing.
 * @param value The value.
 */
export function isThing(value: unknown): boolean {
  return value === 'thing';
}
`;

describe('categoryTagsIn', () => {
  test('reads a value on the same line as the tag', () => {
    deepStrictEqual(categoryTagsIn(parse(VALID)), [
      { value: 'Text Processing', line: 3 },
    ]);
  });

  test('reads a value that starts on the line after the tag', () => {
    deepStrictEqual(categoryTagsIn(parse(MULTILINE_INVALID)), [
      { value: 'Made Up', line: 3 },
    ]);
  });

  test('reads a bare tag as an empty value', () => {
    deepStrictEqual(categoryTagsIn(parse(BARE)), [{ value: '', line: 3 }]);
  });

  test('lists a tag on a variable statement once', () => {
    const text = `/**
 * A value.
 * @category Reflection
 */
export const thing = 1;
`;
    strictEqual(categoryTagsIn(parse(text)).length, 1);
  });

  test('finds tags on declarations that are not exported', () => {
    const text = `/**
 * @category Made Up
 */
function helper(): void {}
`;
    deepStrictEqual(problemsIn(text).length, 1);
  });
});

describe('categoryProblem', () => {
  test('accepts a category on the list', () => {
    deepStrictEqual(problemsIn(VALID), []);
  });

  test('refuses a bare tag', () => {
    const [problem] = problemsIn(BARE);
    match(problem ?? '', /^3: @category has no value/);
  });

  test('refuses a value on the next line that is not on the list', () => {
    const [problem] = problemsIn(MULTILINE_INVALID);
    match(problem ?? '', /^3: "Made Up" is not a category/);
  });

  test('refuses a category split across lines', () => {
    const text = `/**
 * @category Fundamental
 * Objects
 */
export function thing(): void {}
`;
    strictEqual(problemsIn(text).length, 1);
  });
});

describe('categoryStateOf', () => {
  test('is valid with a category on the list', () => {
    strictEqual(categoryStateOf(declarationsOf(VALID)), 'valid');
  });

  test('is invalid with a bare tag', () => {
    strictEqual(categoryStateOf(declarationsOf(BARE)), 'invalid');
  });

  test('is invalid with a value that is not on the list', () => {
    strictEqual(categoryStateOf(declarationsOf(MULTILINE_INVALID)), 'invalid');
  });

  test('is missing with no tag at all', () => {
    strictEqual(categoryStateOf(declarationsOf(MISSING)), 'missing');
  });
});
