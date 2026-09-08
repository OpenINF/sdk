// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArrayBuffer } from '../../src/guards/is-array-buffer';

describe(isArrayBuffer.name, () => {
  it('should detect an ArrayBuffer', () => {
    assert.strictEqual(isArrayBuffer(new ArrayBuffer(16)), true);
  });

  it('should reject a SharedArrayBuffer', () => {
    assert.strictEqual(isArrayBuffer(new SharedArrayBuffer(16)), false);
  });

  it('should reject non-array-buffer values', () => {
    assert.strictEqual(isArrayBuffer([]), false);
  });
});
