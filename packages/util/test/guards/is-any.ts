// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isAny } from '../../src/guards/is-any';

describe(isAny.name, () => {
  it('should always return true', () => {
    assert.strictEqual(isAny(0), true);
    assert.strictEqual(isAny(''), true);
    assert.strictEqual(isAny(null), true);
    assert.strictEqual(isAny(undefined), true);
    assert.strictEqual(isAny({}), true);
  });
});
