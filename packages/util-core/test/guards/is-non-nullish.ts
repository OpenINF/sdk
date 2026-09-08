// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNonNullish } from '../../src/guards/is-non-nullish';

describe(isNonNullish.name, () => {
  it('should detect non-nullish values', () => {
    assert.strictEqual(isNonNullish(NaN), true);
    assert.strictEqual(isNonNullish(0), true);
    assert.strictEqual(isNonNullish(''), true);
  });

  it('should reject null and undefined', () => {
    assert.strictEqual(isNonNullish(null), false);
    assert.strictEqual(isNonNullish(void 0), false);
  });
});
