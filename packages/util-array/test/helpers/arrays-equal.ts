// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { arraysEqual } from '../../src/helpers/arrays-equal';

describe(arraysEqual.name, () => {
  it('should return true for arrays with equal elements', () => {
    assert.strictEqual(arraysEqual([1, 2, 3], [1, 2, 3]), true);
    assert.strictEqual(arraysEqual([], []), true);
  });

  it('should return false for arrays of different lengths', () => {
    assert.strictEqual(arraysEqual([1, 2], [1, 2, 3]), false);
  });

  it('should return false when any element differs', () => {
    assert.strictEqual(arraysEqual([1, 2], [1, 3]), false);
  });

  it('should compare sparse array shapes and values', () => {
    assert.strictEqual(arraysEqual(new Array(1), [123]), false);
    assert.strictEqual(arraysEqual(new Array(1), [undefined]), false);
    assert.strictEqual(arraysEqual(new Array(1), new Array(1)), true);
  });

  it('should use a custom equality comparer when provided', () => {
    const caseInsensitive = (a: string, b: string): boolean =>
      a.toLowerCase() === b.toLowerCase();
    assert.strictEqual(
      arraysEqual(['A', 'B'], ['a', 'b'], caseInsensitive),
      true
    );
  });
});
