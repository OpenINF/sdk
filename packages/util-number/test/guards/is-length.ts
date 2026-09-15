// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isLength } from '../../src/guards/is-length';

describe(isLength.name, () => {
  it('should detect valid array-like lengths', () => {
    assert.strictEqual(isLength(0), true);
    assert.strictEqual(isLength(3), true);
  });

  it('should reject invalid lengths', () => {
    assert.strictEqual(isLength(-1), false);
    assert.strictEqual(isLength(3.5), false);
    assert.strictEqual(isLength(Infinity), false);
    assert.strictEqual(isLength('3'), false);
  });
});
