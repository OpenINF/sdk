// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArray } from '../../src/guards/is-array';

describe(isArray.name, () => {
  it('should detect arrays', () => {
    assert.strictEqual(isArray([]), true);
    assert.strictEqual(isArray(new Array()), true);
  });

  it('should reject non-arrays', () => {
    assert.strictEqual(isArray({}), false);
    assert.strictEqual(isArray('array'), false);
    assert.strictEqual(isArray(null), false);
  });
});
