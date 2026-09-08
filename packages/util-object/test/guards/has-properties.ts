// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hasProperties } from '../../src/guards/has-properties';

const isNumberGuard = (v: unknown): v is number => typeof v === 'number';

describe(hasProperties.name, () => {
  const isPoint = hasProperties({ x: isNumberGuard, y: isNumberGuard });

  it('should return true when every property satisfies its validator', () => {
    assert.strictEqual(isPoint({ x: 1, y: 2 }), true);
  });

  it('should return false when a property fails its validator', () => {
    assert.strictEqual(isPoint({ x: 1, y: 'nope' }), false);
  });

  it('should return false when a property is missing', () => {
    assert.strictEqual(isPoint({ x: 1 }), false);
  });

  it('should return false for non-object-like values', () => {
    assert.strictEqual(isPoint(null), false);
    assert.strictEqual(isPoint(5), false);
  });

  it('should set a default expectation', () => {
    assert.strictEqual(isPoint.expectation, 'have specified properties');
  });
});
