// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isUndefined } from '../../src/guards/is-undefined';

describe(isUndefined.name, () => {
  it('should detect undefined', () => {
    assert.strictEqual(isUndefined(void 0), true);
    assert.strictEqual(isUndefined(undefined), true);
  });

  it('should reject non-undefined values', () => {
    assert.strictEqual(isUndefined(null), false);
    assert.strictEqual(isUndefined(0), false);
  });
});
