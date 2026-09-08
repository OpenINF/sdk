// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isBigInt64Array } from '../../src/guards/is-big-int64-array';

describe(isBigInt64Array.name, () => {
  it('should detect a BigInt64Array', () => {
    assert.strictEqual(isBigInt64Array(new BigInt64Array()), true);
  });

  it('should reject other typed arrays', () => {
    assert.strictEqual(isBigInt64Array(new Int32Array()), false);
  });

  it('should reject non-typed-array values', () => {
    assert.strictEqual(isBigInt64Array([]), false);
  });
});
