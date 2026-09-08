// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isAnyArrayBuffer } from '../../src/guards/is-any-array-buffer';

describe(isAnyArrayBuffer.name, () => {
  it('should detect ArrayBuffer instances', () => {
    assert.strictEqual(isAnyArrayBuffer(new ArrayBuffer(16)), true);
  });

  it('should detect SharedArrayBuffer instances', () => {
    assert.strictEqual(isAnyArrayBuffer(new SharedArrayBuffer(16)), true);
  });

  it('should reject non-array-buffer values', () => {
    assert.strictEqual(isAnyArrayBuffer([]), false);
    assert.strictEqual(isAnyArrayBuffer(null), false);
  });
});
