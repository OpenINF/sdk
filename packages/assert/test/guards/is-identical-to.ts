// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isIdenticalTo } from '../../src/guards/is-identical-to';

describe(isIdenticalTo.name, () => {
  it('should match identical values', () => {
    const guard = isIdenticalTo('foo');
    assert.strictEqual(guard('foo'), true);
  });

  it('should not match different values', () => {
    const guard = isIdenticalTo('foo');
    assert.strictEqual(guard('bar'), false);
  });

  it('should use SameValueZero semantics for NaN', () => {
    const guard = isIdenticalTo(NaN);
    assert.strictEqual(guard(NaN), true);
  });

  it('should not delegate to an Equatable equals method', () => {
    const equatable = { equals: () => true };
    const guard = isIdenticalTo(equatable);
    assert.strictEqual(guard({ equals: () => true }), false);
    assert.strictEqual(guard(equatable), true);
  });
});
