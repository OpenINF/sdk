// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isBoolean } from '../../src/guards/is-boolean';

describe(isBoolean.name, () => {
  it('should detect booleans', () => {
    assert.strictEqual(isBoolean(true), true);
    assert.strictEqual(isBoolean(false), true);
  });

  it('should reject non-booleans', () => {
    assert.strictEqual(isBoolean(1), false);
    assert.strictEqual(isBoolean(null), false);
    assert.strictEqual(isBoolean('true'), false);
  });
});
