// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isIteratorHelper } from '../../src/guards/is-iterator-helper';

describe(isIteratorHelper.name, () => {
  it('should detect an Iterator Helper', () => {
    assert.strictEqual(isIteratorHelper([1, 2].values().map((n) => n)), true);
  });

  it('should reject the other iterators', () => {
    assert.strictEqual(
      isIteratorHelper([1, 2].values()),
      false,
      'Array Iterator'
    );
    assert.strictEqual(
      isIteratorHelper('ab'[Symbol.iterator]()),
      false,
      'String Iterator'
    );
  });

  it('should reject what it iterates, and a plain object', () => {
    assert.strictEqual(isIteratorHelper([1, 2]), false);
    assert.strictEqual(isIteratorHelper({}), false);
    assert.strictEqual(isIteratorHelper(null), false);
  });
});
