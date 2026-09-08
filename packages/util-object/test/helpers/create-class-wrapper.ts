// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createClassWrapper } from '../../src/helpers/create-class-wrapper';

class Foo {
  public constructor(public x: number) {}
}

describe(createClassWrapper.name, () => {
  const WrappedFoo = createClassWrapper(Foo);

  it('should construct an instance when called with new', () => {
    const a = new WrappedFoo(1);
    assert.ok(a instanceof Foo);
    assert.strictEqual(a.x, 1);
  });

  it('should construct an instance when called without new', () => {
    const b = WrappedFoo(2);
    assert.ok(b instanceof Foo);
    assert.strictEqual(b.x, 2);
  });

  it('should mask the wrapper with the original name and length', () => {
    assert.strictEqual(WrappedFoo.name, 'Foo');
    assert.strictEqual(WrappedFoo.length, 1);
  });
});
