// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isDeepEqualTo } from '../../src/guards/is-deep-equal-to';
import { isEqualTo } from '../../src/guards/is-equal-to';
import { isIdenticalTo } from '../../src/guards/is-identical-to';

function checkEqualityTypes(expected: string, value: string | number): void {
  if (!isEqualTo(expected)(value)) {
    // @ts-expect-error A different string is still possible.
    const number: number = value;
    void number;
  }
  if (!isIdenticalTo(expected)(value)) {
    // @ts-expect-error A different string is still possible.
    const number: number = value;
    void number;
  }
  if (!isDeepEqualTo(expected)(value)) {
    // @ts-expect-error A different string is still possible.
    const number: number = value;
    void number;
  }
}
void checkEqualityTypes;

class TaggedArray extends Array<unknown> {
  tag(): string {
    return 'tag';
  }
}

function checkEqualValueTypes(value: unknown): void {
  if (isEqualTo({ equals: (other: unknown) => other === 'x' })(value)) {
    // @ts-expect-error Equatable.equals can accept another type.
    value.equals('x');
  }
  if (isDeepEqualTo(new TaggedArray())(value)) {
    // @ts-expect-error Deep equality does not establish inherited methods.
    value.tag();
  }
}
void checkEqualValueTypes;

describe('equality validators', () => {
  it('compares array contents without claiming inherited methods', () => {
    assert.strictEqual(isDeepEqualTo(new TaggedArray())([]), true);
  });
});
