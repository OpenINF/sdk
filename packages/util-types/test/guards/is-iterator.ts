// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isIterator } from '../../src/guards/is-iterator';

describe(isIterator.name, () => {
  it('should detect iterators', () => {
    assert.strictEqual(isIterator([][Symbol.iterator]()), true);
    assert.strictEqual(isIterator(new Map()[Symbol.iterator]()), true);
    assert.strictEqual(isIterator({ next: () => ({ done: true }) }), true);

    const callable = Object.assign(() => undefined, {
      next: () => ({ done: true }),
    });
    assert.strictEqual(isIterator(callable), true);
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

  it('should return false when reading next throws', () => {
    const hostile = Object.defineProperty({}, 'next', {
      get: () => {
        throw new Error('no access');
      },
    });

    assert.strictEqual(isIterator(hostile), false);
  });

  it('should not read Symbol.iterator', () => {
    const iterator = {
      next: () => ({ done: true }),
      get [Symbol.iterator](): never {
        throw new Error('not part of the iterator protocol');
      },
    };

    assert.strictEqual(isIterator(iterator), true);
  });
});
