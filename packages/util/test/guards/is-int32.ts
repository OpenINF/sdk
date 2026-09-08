// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isInt32 } from '../../src/guards/is-int32';

describe(isInt32.name, () => {
  it('should detect int32 values', () => {
    assert.strictEqual(isInt32(123), true);
    assert.strictEqual(isInt32(-123), true);
    assert.strictEqual(isInt32(0), true);
  });

  it('should reject non-int32 values', () => {
    assert.strictEqual(isInt32('abc'), false);
    assert.strictEqual(isInt32(2147483648), false);
  });
});
