// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isInt32Array } from '../../src/guards/is-int32-array';

describe(isInt32Array.name, () => {
  it('should detect an Int32Array', () => {
    assert.strictEqual(isInt32Array(new Int32Array()), true);
  });

  it('should reject other typed arrays', () => {
    assert.strictEqual(isInt32Array(new Uint32Array()), false);
  });

  it('should reject non-typed-array values', () => {
    assert.strictEqual(isInt32Array([]), false);
  });
});
