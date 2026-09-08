// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isInt8Array } from '../../src/guards/is-int8-array';

describe(isInt8Array.name, () => {
  it('should detect an Int8Array', () => {
    assert.strictEqual(isInt8Array(new Int8Array()), true);
  });

  it('should reject other typed arrays', () => {
    assert.strictEqual(isInt8Array(new Uint8Array()), false);
  });

  it('should reject non-typed-array values', () => {
    assert.strictEqual(isInt8Array([]), false);
  });
});
