// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isAsyncGenerator } from '../../src/guards/is-async-generator';

describe(isAsyncGenerator.name, () => {
  it('should detect an async generator object', () => {
    async function* gen(): AsyncGenerator<void> {}
    assert.strictEqual(isAsyncGenerator(gen()), true);
  });

  it('should reject the generator function itself', () => {
    async function* gen(): AsyncGenerator<void> {}
    assert.strictEqual(isAsyncGenerator(gen), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isAsyncGenerator(null), false);
    assert.strictEqual(isAsyncGenerator(42), false);
  });
});
