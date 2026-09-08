// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isTypedArray } from '../../src/guards/is-typed-array';

describe(isTypedArray.name, () => {
  it('should detect typed arrays', () => {
    assert.strictEqual(isTypedArray(new Uint8Array()), true);
    assert.strictEqual(isTypedArray(new Float64Array()), true);
    assert.strictEqual(isTypedArray(new BigInt64Array()), true);
  });

  it('should reject a plain array', () => {
    assert.strictEqual(isTypedArray([]), false);
  });

  it('should reject a DataView', () => {
    assert.strictEqual(isTypedArray(new DataView(new ArrayBuffer(16))), false);
  });
});
