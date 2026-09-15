// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isMapLike } from '../../src/guards/is-map-like';

describe(isMapLike.name, () => {
  it('should detect a plain object', () => {
    assert.strictEqual(isMapLike({ a: 1 }), true);
  });

  it('should reject an array', () => {
    assert.strictEqual(isMapLike([1, 2, 3]), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isMapLike(null), false);
    assert.strictEqual(isMapLike(42), false);
  });
});
