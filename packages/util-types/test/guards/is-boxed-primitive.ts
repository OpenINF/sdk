// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isBoxedPrimitive } from '../../src/guards/is-boxed-primitive';

describe(isBoxedPrimitive.name, () => {
  it('should detect boxed primitives', () => {
    assert.strictEqual(isBoxedPrimitive(new Boolean(true)), true);
    assert.strictEqual(isBoxedPrimitive(new String('foo')), true);
    assert.strictEqual(isBoxedPrimitive(new Number(0)), true);
    assert.strictEqual(isBoxedPrimitive(Object(Symbol('foo'))), true);
    assert.strictEqual(isBoxedPrimitive(Object(BigInt(1))), true);
  });

  it('should reject unboxed primitives', () => {
    assert.strictEqual(isBoxedPrimitive(false), false);
    assert.strictEqual(isBoxedPrimitive('foo'), false);
    assert.strictEqual(isBoxedPrimitive(0), false);
  });
});
