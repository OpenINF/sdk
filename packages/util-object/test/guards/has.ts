// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { has } from '../../src/guards/has';

describe(has.name, () => {
  it('should return true for an own property', () => {
    assert.strictEqual(has({ a: 1 }, 'a'), true);
  });

  it('should return true for an inherited property', () => {
    const obj = Object.create({ a: 1 }) as Record<string, unknown>;
    assert.strictEqual(has(obj, 'a'), true);
  });

  it('should return false for a missing property', () => {
    assert.strictEqual(has<string>({}, 'a'), false);
  });
});
