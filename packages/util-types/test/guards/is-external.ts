// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isExternal } from '../../src/guards/is-external';

describe(isExternal.name, () => {
  it('should always return false', () => {
    assert.strictEqual(isExternal({}), false);
    assert.strictEqual(isExternal(null), false);
    assert.strictEqual(isExternal(42), false);
  });
});
