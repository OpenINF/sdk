// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isSetIterator } from '../../src/guards/is-set-iterator';

describe(isSetIterator.name, () => {
  it('should detect a Set iterator', () => {
    assert.strictEqual(isSetIterator(new Set().values()), true);
  });

  it('should reject a Map iterator', () => {
    assert.strictEqual(isSetIterator(new Map().keys()), false);
  });

  it('should reject non-iterator values', () => {
    assert.strictEqual(isSetIterator(new Set()), false);
  });
});
