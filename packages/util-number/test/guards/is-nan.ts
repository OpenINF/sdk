// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNaN } from '../../src/guards/is-nan';

describe(isNaN.name, () => {
  it('should detect NaN', () => {
    assert.strictEqual(isNaN(NaN), true);
    assert.strictEqual(isNaN(new Number(NaN).valueOf()), true);
  });

  it('should reject non-NaN values', () => {
    assert.strictEqual(isNaN(undefined), false);
    assert.strictEqual(isNaN(0), false);
    assert.strictEqual(isNaN('NaN'), false);
  });
});
