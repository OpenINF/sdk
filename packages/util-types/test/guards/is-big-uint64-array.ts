// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isBigUint64Array } from '../../src/guards/is-big-uint64-array';

describe(isBigUint64Array.name, () => {
  it('should detect a BigUint64Array', () => {
    assert.strictEqual(isBigUint64Array(new BigUint64Array()), true);
  });

  it('should reject other typed arrays', () => {
    assert.strictEqual(isBigUint64Array(new Uint32Array()), false);
  });

  it('should reject non-typed-array values', () => {
    assert.strictEqual(isBigUint64Array([]), false);
  });
});
