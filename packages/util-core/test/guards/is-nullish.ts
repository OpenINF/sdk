// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNullish } from '../../src/guards/is-nullish';

describe(isNullish.name, () => {
  it('should detect nullish values', () => {
    assert.strictEqual(isNullish(null), true);
    assert.strictEqual(isNullish(void 0), true);
  });

  it('should reject non-nullish values', () => {
    assert.strictEqual(isNullish(NaN), false);
    assert.strictEqual(isNullish(0), false);
    assert.strictEqual(isNullish(''), false);
  });
});
