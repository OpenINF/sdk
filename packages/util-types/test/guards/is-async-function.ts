// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isAsyncFunction } from '../../src/guards/is-async-function';

describe(isAsyncFunction.name, () => {
  it('should detect an async function', () => {
    assert.strictEqual(
      isAsyncFunction(async function foo(): Promise<void> {}),
      true
    );
  });

  it('should reject a plain function', () => {
    assert.strictEqual(
      isAsyncFunction(function foo(): void {}),
      false
    );
  });
});
