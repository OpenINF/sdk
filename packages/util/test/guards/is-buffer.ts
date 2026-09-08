// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isBuffer } from '../../src/guards/is-buffer';

describe(isBuffer.name, () => {
  it('should detect Buffers', () => {
    assert.strictEqual(isBuffer(Buffer.from('foo')), true);
    assert.strictEqual(isBuffer(Buffer.alloc(10)), true);
  });

  it('should reject non-Buffers', () => {
    assert.strictEqual(isBuffer({ length: 0 }), false);
    assert.strictEqual(isBuffer([]), false);
    assert.strictEqual(isBuffer(new Uint8Array(1024)), false);
  });
});
