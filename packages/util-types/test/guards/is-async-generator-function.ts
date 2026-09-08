// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isAsyncGeneratorFunction } from '../../src/guards/is-async-generator-function';

describe(isAsyncGeneratorFunction.name, () => {
  it('should detect an async generator function', () => {
    async function* gen(): AsyncGenerator<void> {}
    assert.strictEqual(isAsyncGeneratorFunction(gen), true);
  });

  it('should reject a plain function', () => {
    assert.strictEqual(
      isAsyncGeneratorFunction(function foo(): void {}),
      false
    );
  });

  it('should reject a generator function', () => {
    function* gen(): Generator<void> {}
    assert.strictEqual(isAsyncGeneratorFunction(gen), false);
  });

  it('should reject an async function', () => {
    assert.strictEqual(
      isAsyncGeneratorFunction(async function foo(): Promise<void> {}),
      false
    );
  });
});
