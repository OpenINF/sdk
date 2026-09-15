// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isFloat64Array } from '../../src/guards/is-float64-array';

describe(isFloat64Array.name, () => {
  it('should detect a Float64Array', () => {
    assert.strictEqual(isFloat64Array(new Float64Array()), true);
  });

  it('should reject other typed arrays', () => {
    assert.strictEqual(isFloat64Array(new Float32Array()), false);
  });

  it('should reject non-typed-array values', () => {
    assert.strictEqual(isFloat64Array([]), false);
  });
});
