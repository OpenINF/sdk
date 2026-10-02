// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArray } from '../../src/guards/is-array';
import type { Guard } from '../../src/types';

function checkArrayTypes(value: unknown): void {
  // @ts-expect-error Array membership does not establish an element type.
  isArray<string>(value);
  // @ts-expect-error Contextual typing must not choose an unchecked element type.
  const isStringArray: Guard<string[]> = isArray;
  void isStringArray;

  if (isArray(value)) {
    const elements: unknown[] = value;
    // @ts-expect-error Array elements have not been validated.
    const strings: string[] = value;
    void elements;
    void strings;
  }
}
void checkArrayTypes;

describe(isArray.name, () => {
  it('should detect arrays', () => {
    assert.strictEqual(isArray([]), true);
    assert.strictEqual(isArray(new Array()), true);
  });

  it('should reject non-arrays', () => {
    assert.strictEqual(isArray({}), false);
    assert.strictEqual(isArray('array'), false);
    assert.strictEqual(isArray(null), false);
  });
});
