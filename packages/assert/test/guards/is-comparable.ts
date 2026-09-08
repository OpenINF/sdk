// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isComparable } from '../../src/guards/is-comparable';

describe(isComparable.name, () => {
  it('should detect values with a compareTo method', () => {
    assert.strictEqual(isComparable({ compareTo: () => 0 }), true);
  });

  it('should reject values without a compareTo method', () => {
    assert.strictEqual(isComparable({}), false);
    assert.strictEqual(isComparable(null), false);
    assert.strictEqual(isComparable(undefined), false);
    assert.strictEqual(isComparable(1), false);
  });
});
