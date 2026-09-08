// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isInt16Array } from '../../src/guards/is-int16-array';

describe(isInt16Array.name, () => {
  it('should detect an Int16Array', () => {
    assert.strictEqual(isInt16Array(new Int16Array()), true);
  });

  it('should reject other typed arrays', () => {
    assert.strictEqual(isInt16Array(new Uint16Array()), false);
  });

  it('should reject non-typed-array values', () => {
    assert.strictEqual(isInt16Array([]), false);
  });
});
