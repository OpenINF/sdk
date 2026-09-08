// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isFloat32Array } from '../../src/guards/is-float32-array';

describe(isFloat32Array.name, () => {
  it('should detect a Float32Array', () => {
    assert.strictEqual(isFloat32Array(new Float32Array()), true);
  });

  it('should reject other typed arrays', () => {
    assert.strictEqual(isFloat32Array(new Float64Array()), false);
  });

  it('should reject non-typed-array values', () => {
    assert.strictEqual(isFloat32Array([]), false);
  });
});
