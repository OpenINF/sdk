// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { equalOwnProperties } from '../../src/guards/equal-own-properties';

describe(equalOwnProperties.name, () => {
  it('should return true for shallowly equal objects', () => {
    assert.strictEqual(
      equalOwnProperties({ a: 1, b: 2 }, { a: 1, b: 2 }),
      true
    );
  });

  it('should return false when a value differs', () => {
    assert.strictEqual(equalOwnProperties({ a: 1 }, { a: 2 }), false);
  });

  it('should return false when keys differ', () => {
    assert.strictEqual(equalOwnProperties({ a: 1 }, { a: 1, b: 2 }), false);
    assert.strictEqual(equalOwnProperties({ a: 1, b: 2 }, { a: 1 }), false);
  });

  it('should return true for the same reference, even both undefined', () => {
    const obj = { a: 1 };
    assert.strictEqual(equalOwnProperties(obj, obj), true);
    assert.strictEqual(equalOwnProperties(undefined, undefined), true);
  });

  it('should return false when only one side is undefined', () => {
    assert.strictEqual(equalOwnProperties(undefined, {}), false);
    assert.strictEqual(equalOwnProperties({}, undefined), false);
  });

  it('should use a custom equality comparer when provided', () => {
    assert.strictEqual(
      equalOwnProperties<string | number>(
        { a: 1 },
        { a: '1' },
        (a, b) => String(a) === String(b)
      ),
      true
    );
  });
});
