// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hasOwn } from '../../src/guards/has-own';

describe(hasOwn.name, () => {
  it('should return true for an own property', () => {
    assert.strictEqual(hasOwn({ a: 1 }, 'a'), true);
  });

  it('should return false for a missing property', () => {
    // No explicit type argument needed: the old signature required the object
    // to already carry the property being tested for.
    assert.strictEqual(hasOwn({}, 'a'), false);
  });

  it('should accept any object, including one of unknown shape', () => {
    const parsed: object = JSON.parse('{"id":1}') as object;
    assert.strictEqual(hasOwn(parsed, 'id'), true);
    assert.strictEqual(hasOwn(parsed, 'nope'), false);
  });

  it('should narrow the object so the property can be read', () => {
    const value: object = { id: 7 };
    if (hasOwn(value, 'id')) {
      // Reading value.id here is the point: without narrowing this would be
      // a compile error on `object`.
      assert.strictEqual(value.id, 7);
    } else {
      assert.fail('expected the property to be present');
    }
  });

  it('should return false for an inherited property', () => {
    const obj = Object.create({ a: 1 }) as Record<string, unknown>;
    assert.strictEqual(hasOwn(obj, 'a'), false);
  });
});
