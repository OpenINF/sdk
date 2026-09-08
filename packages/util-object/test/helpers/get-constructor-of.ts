// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getConstructorOf } from '../../src/helpers/get-constructor-of';

describe(getConstructorOf.name, () => {
  it('should find a class instance constructor', () => {
    class Foo {}
    assert.strictEqual(getConstructorOf(new Foo()), Foo);
  });

  it('should find the Object constructor for plain objects', () => {
    assert.strictEqual(getConstructorOf({}), Object);
  });

  it('should return null when the prototype chain has no named constructor', () => {
    assert.strictEqual(getConstructorOf(Object.create(null)), null);
  });
});
