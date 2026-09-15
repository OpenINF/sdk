// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isBigIntObject } from '../../src/guards/is-big-int-object';

describe(isBigIntObject.name, () => {
  it('should detect a boxed BigInt object', () => {
    assert.strictEqual(isBigIntObject(Object(BigInt(10))), true);
  });

  it('should reject a BigInt primitive', () => {
    assert.strictEqual(isBigIntObject(BigInt(10)), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isBigIntObject(10), false);
    assert.strictEqual(isBigIntObject(null), false);
  });
});
