// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isUint8Array } from '../../src/guards/is-uint8-array';

describe(isUint8Array.name, () => {
  it('should detect a Uint8Array', () => {
    assert.strictEqual(isUint8Array(new Uint8Array()), true);
  });

  it('should reject other typed arrays', () => {
    assert.strictEqual(isUint8Array(new Int8Array()), false);
    assert.strictEqual(isUint8Array(new Uint8ClampedArray()), false);
  });

  it('should reject non-typed-array values', () => {
    assert.strictEqual(isUint8Array([]), false);
  });
});
