// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isSharedArrayBuffer } from '../../src/guards/is-shared-array-buffer';

describe(isSharedArrayBuffer.name, () => {
  it('should detect a SharedArrayBuffer', () => {
    assert.strictEqual(isSharedArrayBuffer(new SharedArrayBuffer(16)), true);
  });

  it('should reject a plain ArrayBuffer', () => {
    assert.strictEqual(isSharedArrayBuffer(new ArrayBuffer(16)), false);
  });

  it('should reject non-buffer values', () => {
    assert.strictEqual(isSharedArrayBuffer([]), false);
  });
});
