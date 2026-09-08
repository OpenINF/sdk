// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isWeakSet } from '../../src/guards/is-weak-set';

describe(isWeakSet.name, () => {
  it('should detect a WeakSet instance', () => {
    assert.strictEqual(isWeakSet(new WeakSet()), true);
  });

  it('should reject a Set instance', () => {
    assert.strictEqual(isWeakSet(new Set()), false);
  });

  it('should reject a WeakSet-tagged object without internal slots', () => {
    const fake: unknown = { [Symbol.toStringTag]: 'WeakSet' };
    assert.strictEqual(isWeakSet(fake), false);
  });
});
