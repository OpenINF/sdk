// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArrayIterator } from '../../src/guards/is-array-iterator';

describe(isArrayIterator.name, () => {
  it('should detect an Array Iterator', () => {
    assert.strictEqual(isArrayIterator([1, 2].values()), true);
  });

  it('should reject the other iterators', () => {
    assert.strictEqual(
      isArrayIterator('ab'[Symbol.iterator]()),
      false,
      'String Iterator'
    );
    assert.strictEqual(
      isArrayIterator('aa'.matchAll(/a/g)),
      false,
      'RegExp String Iterator'
    );
  });

  it('should reject what it iterates, and a plain object', () => {
    assert.strictEqual(isArrayIterator([1, 2]), false);
    assert.strictEqual(isArrayIterator({}), false);
    assert.strictEqual(isArrayIterator(null), false);
  });
});
