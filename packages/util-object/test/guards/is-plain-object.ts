// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isPlainObject } from '../../src/guards/is-plain-object';

describe(isPlainObject.name, () => {
  it('should detect object literals', () => {
    assert.strictEqual(isPlainObject({ x: 0, y: 0 }), true);
  });

  it('should detect objects with a null prototype', () => {
    assert.strictEqual(isPlainObject(Object.create(null)), true);
  });

  it('should reject arrays', () => {
    assert.strictEqual(isPlainObject([1, 2, 3]), false);
  });

  it('should reject class instances', () => {
    function Foo(this: { a: number }): void {
      this.a = 1;
    }
    assert.strictEqual(isPlainObject(new (Foo as any)()), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isPlainObject(null), false);
    assert.strictEqual(isPlainObject(42), false);
  });
});
