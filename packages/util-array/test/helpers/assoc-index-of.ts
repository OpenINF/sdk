// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assocIndexOf } from '../../src/helpers/assoc-index-of';

describe(assocIndexOf.name, () => {
  const pairs: unknown[][] = [
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ];

  it('should return the index of the matching key', () => {
    assert.strictEqual(assocIndexOf(pairs, 'a'), 0);
    assert.strictEqual(assocIndexOf(pairs, 'b'), 1);
    assert.strictEqual(assocIndexOf(pairs, 'c'), 2);
  });

  it('should return -1 when the key is not found', () => {
    assert.strictEqual(assocIndexOf(pairs, 'z'), -1);
    assert.strictEqual(assocIndexOf([], 'a'), -1);
  });
});
