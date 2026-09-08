// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

import { memo } from '../../src/helpers/memo';

describe(memo.name, () => {
  it('should generate and cache a value on first access', () => {
    const obj: { x?: number } = {};
    const factory = mock.fn(() => 42);

    assert.strictEqual(memo(obj, 'x', factory), 42);
    assert.strictEqual(obj.x, 42);
    assert.strictEqual(factory.mock.callCount(), 1);
  });

  it('should not call the factory again once the value is set', () => {
    const obj: { x?: number } = { x: 1 };
    const factory = mock.fn(() => 42);

    assert.strictEqual(memo(obj, 'x', factory), 1);
    assert.strictEqual(factory.mock.callCount(), 0);
  });
});
