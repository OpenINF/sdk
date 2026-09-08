// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isWeakMap } from '../../src/guards/is-weak-map';

describe(isWeakMap.name, () => {
  it('should detect a WeakMap instance', () => {
    assert.strictEqual(isWeakMap(new WeakMap()), true);
  });

  it('should reject a Map instance', () => {
    assert.strictEqual(isWeakMap(new Map()), false);
  });

  it('should reject a plain object', () => {
    assert.strictEqual(isWeakMap({}), false);
  });
});
