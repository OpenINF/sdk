// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isObjectLike } from '../../src/guards/is-object-like';

describe(isObjectLike.name, () => {
  it('should detect objects, arrays, and functions', () => {
    assert.strictEqual(isObjectLike({}), true);
    assert.strictEqual(isObjectLike([1, 2, 3]), true);
    assert.strictEqual(
      isObjectLike(() => {}),
      true
    );
  });

  it('should reject null', () => {
    assert.strictEqual(isObjectLike(null), false);
  });

  it('should reject primitives', () => {
    assert.strictEqual(isObjectLike(1), false);
    assert.strictEqual(isObjectLike('a'), false);
    assert.strictEqual(isObjectLike(undefined), false);
  });
});
