// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isIterable } from '../../src/guards/is-iterable';

describe(isIterable.name, () => {
  it('should detect the built-in iterables', () => {
    assert.strictEqual(isIterable([1, 2]), true);
    assert.strictEqual(isIterable(new Map()), true);
    assert.strictEqual(isIterable(new Set()), true);
    assert.strictEqual(isIterable([1, 2].values()), true);
  });

  it('should detect an object that defines the method itself', () => {
    assert.strictEqual(isIterable({ *[Symbol.iterator]() {} }), true);
  });

  it('should reject an object without it, and every primitive', () => {
    assert.strictEqual(isIterable({}), false);
    assert.strictEqual(isIterable('ab'), false);
    assert.strictEqual(isIterable(null), false);
  });

  it('should reject a value whose getter throws, rather than throwing', () => {
    const hostile = Object.defineProperty({}, Symbol.iterator, {
      get() {
        throw new Error('nope');
      },
    });
    assert.strictEqual(isIterable(hostile), false);
  });
});
