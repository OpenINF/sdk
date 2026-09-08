// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { propertyIsEnumerable } from '../../src/guards/property-is-enumerable';

describe(propertyIsEnumerable.name, () => {
  it('should return true for an own enumerable property', () => {
    assert.strictEqual(propertyIsEnumerable({ a: 1 }, 'a'), true);
  });

  it('should return false for a missing property', () => {
    assert.strictEqual(propertyIsEnumerable<string>({}, 'a'), false);
  });

  it('should return false for an own non-enumerable property', () => {
    const obj: Record<string, unknown> = {};
    Object.defineProperty(obj, 'z', { value: 1, enumerable: false });
    assert.strictEqual(propertyIsEnumerable(obj, 'z'), false);
  });

  it('should walk the prototype chain for inherited properties', () => {
    const enumerableProto: Record<string, unknown> = {};
    Object.defineProperty(enumerableProto, 'x', {
      value: 1,
      enumerable: true,
    });
    const obj = Object.create(enumerableProto) as Record<string, unknown>;
    assert.strictEqual(propertyIsEnumerable(obj, 'x'), true);
  });

  it('should return false for an inherited non-enumerable property', () => {
    const nonEnumerableProto: Record<string, unknown> = {};
    Object.defineProperty(nonEnumerableProto, 'y', {
      value: 1,
      enumerable: false,
    });
    const obj = Object.create(nonEnumerableProto) as Record<string, unknown>;
    assert.strictEqual(propertyIsEnumerable(obj, 'y'), false);
  });
});
