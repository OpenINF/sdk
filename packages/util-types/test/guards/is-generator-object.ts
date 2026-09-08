// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isGeneratorObject } from '../../src/guards/is-generator-object';

function* infinite(): Generator<number> {
  let index = 0;
  while (true) {
    yield index++;
  }
}

describe(isGeneratorObject.name, () => {
  it('should detect a generator object', () => {
    assert.strictEqual(isGeneratorObject(infinite()), true);
  });

  it('should reject the generator function itself', () => {
    assert.strictEqual(isGeneratorObject(infinite), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isGeneratorObject(null), false);
    assert.strictEqual(isGeneratorObject(42), false);
  });
});
