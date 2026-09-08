// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isGeneratorFunction } from '../../src/guards/is-generator-function';

describe(isGeneratorFunction.name, () => {
  it('should detect a generator function', () => {
    function* gen(): Generator<void> {}
    assert.strictEqual(isGeneratorFunction(gen), true);
  });

  it('should reject a plain function', () => {
    assert.strictEqual(
      isGeneratorFunction(function foo(): void {}),
      false
    );
  });
});
