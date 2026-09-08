// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isConstructor } from '../../src/guards/is-constructor';

describe(isConstructor.name, () => {
  it('should detect classes', () => {
    class Foo {}
    assert.strictEqual(isConstructor(Foo), true);
  });

  it('should detect plain constructible functions', () => {
    assert.strictEqual(
      isConstructor(function foo(): void {}),
      true
    );
  });

  it('should reject arrow functions', () => {
    assert.strictEqual(
      isConstructor(() => {}),
      false
    );
  });

  it('should reject non-constructible built-in methods', () => {
    assert.strictEqual(isConstructor(Array.prototype.map), false);
  });

  it('should reject non-functions', () => {
    assert.strictEqual(isConstructor(42), false);
    assert.strictEqual(isConstructor(null), false);
  });
});
