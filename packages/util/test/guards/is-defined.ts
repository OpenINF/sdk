// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isDefined } from '../../src/guards/is-defined';

describe(isDefined.name, () => {
  it('should detect defined values', () => {
    assert.strictEqual(isDefined(0), true);
    assert.strictEqual(isDefined(''), true);
    assert.strictEqual(isDefined(false), true);
  });

  it('should reject undefined and null', () => {
    assert.strictEqual(isDefined(undefined), false);
    assert.strictEqual(isDefined(null), false);
    assert.strictEqual(isDefined(void 0), false);
  });
});
