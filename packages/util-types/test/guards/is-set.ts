// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isSet } from '../../src/guards/is-set';

describe(isSet.name, () => {
  it('should detect a Set instance', () => {
    assert.strictEqual(isSet(new Set()), true);
  });

  it('should reject a Map instance', () => {
    assert.strictEqual(isSet(new Map()), false);
  });

  it('should reject an array', () => {
    assert.strictEqual(isSet([]), false);
  });
});
