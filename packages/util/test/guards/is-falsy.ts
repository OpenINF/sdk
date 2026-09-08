// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isFalsy } from '../../src/guards/is-falsy';

describe(isFalsy.name, () => {
  it('should detect falsy values', () => {
    assert.strictEqual(isFalsy(false), true);
    assert.strictEqual(isFalsy(0), true);
    assert.strictEqual(isFalsy(-0), true);
    assert.strictEqual(isFalsy(0n), true);
    assert.strictEqual(isFalsy(''), true);
    assert.strictEqual(isFalsy(null), true);
    assert.strictEqual(isFalsy(undefined), true);
    assert.strictEqual(isFalsy(NaN), true);
  });

  it('should reject truthy values', () => {
    assert.strictEqual(isFalsy(new Boolean()), false);
    assert.strictEqual(isFalsy(1), false);
    assert.strictEqual(isFalsy('foo'), false);
    assert.strictEqual(isFalsy({}), false);
  });
});
