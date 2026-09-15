// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isUint32Array } from '../../src/guards/is-uint32-array';

describe(isUint32Array.name, () => {
  it('should detect a Uint32Array', () => {
    assert.strictEqual(isUint32Array(new Uint32Array()), true);
  });

  it('should reject other typed arrays', () => {
    assert.strictEqual(isUint32Array(new Int32Array()), false);
  });

  it('should reject non-typed-array values', () => {
    assert.strictEqual(isUint32Array([]), false);
  });
});
