// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isIterator } from '../../src/guards/is-iterator';

describe(isIterator.name, () => {
  it('should detect iterators', () => {
    assert.strictEqual(isIterator([][Symbol.iterator]()), true);
    assert.strictEqual(isIterator(new Map()[Symbol.iterator]()), true);
  });

  it('should reject non-iterators', () => {
    assert.strictEqual(isIterator([]), false);
    assert.strictEqual(isIterator({}), false);
    assert.strictEqual(isIterator(null), false);
    assert.strictEqual(isIterator(undefined), false);
  });

  // The guard used to accept any object carrying a truthy __shouldIterator__
  // property, whatever else it was. Nothing in the language gives that name a
  // meaning, so an object that merely has it is not an iterator.
  it('should reject an object that only sets __shouldIterator__', () => {
    assert.strictEqual(isIterator({ __shouldIterator__: true }), false);
  });
});
