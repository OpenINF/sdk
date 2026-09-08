// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArrayLike } from '../../src/guards/is-array-like';

describe(isArrayLike.name, () => {
  it('should detect real arrays', () => {
    assert.strictEqual(isArrayLike([1, 2, 3]), true);
  });

  it('should detect array-like objects with a valid length', () => {
    assert.strictEqual(isArrayLike('abc'), true);
    assert.strictEqual(isArrayLike({ length: 0 }), true);
    assert.strictEqual(
      isArrayLike({ length: 3, 0: 'a', 1: 'b', 2: 'c' }),
      true
    );
  });

  it('should reject functions', () => {
    assert.strictEqual(isArrayLike(Function), false);
    assert.strictEqual(
      isArrayLike(() => {}),
      false
    );
  });

  it('should reject nullish values', () => {
    assert.strictEqual(isArrayLike(null), false);
    assert.strictEqual(isArrayLike(undefined), false);
  });

  it('should reject objects with an invalid length', () => {
    assert.strictEqual(isArrayLike({ length: -1 }), false);
    assert.strictEqual(isArrayLike({ length: 1.5 }), false);
    assert.strictEqual(isArrayLike({}), false);
  });
});
