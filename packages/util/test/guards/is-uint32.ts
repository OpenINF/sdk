// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isUint32 } from '../../src/guards/is-uint32';

describe(isUint32.name, () => {
  it('should detect uint32 values', () => {
    assert.strictEqual(isUint32(123), true);
    assert.strictEqual(isUint32(0), true);
  });

  it('should reject non-uint32 values', () => {
    assert.strictEqual(isUint32(-1), false);
    assert.strictEqual(isUint32('abc'), false);
  });
});
