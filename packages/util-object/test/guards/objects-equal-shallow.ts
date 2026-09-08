// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { objectsEqualShallow } from '../../src/guards/objects-equal-shallow';

describe(objectsEqualShallow.name, () => {
  it('should return true for shallowly equal objects', () => {
    assert.strictEqual(
      objectsEqualShallow({ a: 1, b: 2 }, { a: 1, b: 2 }),
      true
    );
  });

  it('should return false when a value differs', () => {
    assert.strictEqual(objectsEqualShallow({ a: 1 }, { a: 2 }), false);
  });

  it('should return false when the second object has an extra key', () => {
    assert.strictEqual(objectsEqualShallow({ a: 1 }, { a: 1, b: 2 }), false);
  });

  it('should treat null as only equal to null', () => {
    assert.strictEqual(objectsEqualShallow(null, null), true);
    assert.strictEqual(objectsEqualShallow(null, {}), false);
  });

  it('should treat undefined as only equal to undefined', () => {
    assert.strictEqual(objectsEqualShallow(undefined, undefined), true);
  });
});
