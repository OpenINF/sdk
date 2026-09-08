// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isBigInt } from '../../src/guards/is-big-int';

describe(isBigInt.name, () => {
  it('should detect bigints', () => {
    assert.strictEqual(isBigInt(3n), true);
    assert.strictEqual(isBigInt(BigInt(5)), true);
  });

  it('should reject non-bigints', () => {
    assert.strictEqual(isBigInt(3), false);
    assert.strictEqual(isBigInt(4.4), false);
    assert.strictEqual(isBigInt('3'), false);
  });
});
