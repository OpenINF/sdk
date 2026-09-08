// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isMapIterator } from '../../src/guards/is-map-iterator';

describe(isMapIterator.name, () => {
  it('should detect a Map iterator', () => {
    assert.strictEqual(isMapIterator(new Map().keys()), true);
    assert.strictEqual(isMapIterator(new Map().values()), true);
    assert.strictEqual(isMapIterator(new Map().entries()), true);
  });

  it('should reject a Set iterator', () => {
    assert.strictEqual(isMapIterator(new Set().values()), false);
  });

  it('should reject non-iterator values', () => {
    assert.strictEqual(isMapIterator(new Map()), false);
    assert.strictEqual(isMapIterator([]), false);
  });
});
