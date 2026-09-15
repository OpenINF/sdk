// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isUint16Array } from '../../src/guards/is-uint16-array';

describe(isUint16Array.name, () => {
  it('should detect a Uint16Array', () => {
    assert.strictEqual(isUint16Array(new Uint16Array()), true);
  });

  it('should reject other typed arrays', () => {
    assert.strictEqual(isUint16Array(new Int16Array()), false);
  });

  it('should reject non-typed-array values', () => {
    assert.strictEqual(isUint16Array([]), false);
  });
});
