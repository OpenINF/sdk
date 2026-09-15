// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isUint8ClampedArray } from '../../src/guards/is-uint8-clamped-array';

describe(isUint8ClampedArray.name, () => {
  it('should detect a Uint8ClampedArray', () => {
    assert.strictEqual(isUint8ClampedArray(new Uint8ClampedArray()), true);
  });

  it('should reject a plain Uint8Array', () => {
    assert.strictEqual(isUint8ClampedArray(new Uint8Array()), false);
  });

  it('should reject non-typed-array values', () => {
    assert.strictEqual(isUint8ClampedArray([]), false);
  });
});
