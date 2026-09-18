// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isAsyncIterable } from '../../src/guards/is-async-iterable';

describe(isAsyncIterable.name, () => {
  it('should detect an async generator object', () => {
    assert.strictEqual(isAsyncIterable((async function* () {})()), true);
  });

  it('should detect an object that defines the method itself', () => {
    assert.strictEqual(
      isAsyncIterable({ async *[Symbol.asyncIterator]() {} }),
      true
    );
  });

  it('should reject a synchronous iterable', () => {
    assert.strictEqual(isAsyncIterable([1, 2]), false);
    assert.strictEqual(isAsyncIterable([1, 2].values()), false);
  });

  it('should reject an object without it, and every primitive', () => {
    assert.strictEqual(isAsyncIterable({}), false);
    assert.strictEqual(isAsyncIterable(null), false);
  });
});
