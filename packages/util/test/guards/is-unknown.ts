// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isUnknown } from '../../src/guards/is-unknown';

describe(isUnknown.name, () => {
  it('should always return true', () => {
    assert.strictEqual(isUnknown(0), true);
    assert.strictEqual(isUnknown(''), true);
    assert.strictEqual(isUnknown(null), true);
    assert.strictEqual(isUnknown(undefined), true);
    assert.strictEqual(isUnknown({}), true);
  });
});
