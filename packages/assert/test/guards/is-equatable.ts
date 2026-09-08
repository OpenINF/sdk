// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isEquatable } from '../../src/guards/is-equatable';

describe(isEquatable.name, () => {
  it('should detect values with an equals method', () => {
    assert.strictEqual(isEquatable({ equals: () => true }), true);
  });

  it('should reject values without an equals method', () => {
    assert.strictEqual(isEquatable({}), false);
    assert.strictEqual(isEquatable(null), false);
    assert.strictEqual(isEquatable(undefined), false);
    assert.strictEqual(isEquatable(1), false);
  });
});
