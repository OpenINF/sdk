// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hasProperties } from '../../src/guards/has-properties';

const isNumberGuard = (v: unknown): v is number => typeof v === 'number';
const isUndefinedGuard = (v: unknown): v is undefined => v === undefined;

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

  it('should distinguish a missing property from one containing undefined', () => {
    const hasOptionalValue = hasProperties({ value: isUndefinedGuard });

    assert.strictEqual(hasOptionalValue({ value: undefined }), true);
    assert.strictEqual(hasOptionalValue({}), false);
  });

  it('should validate symbol-keyed properties', () => {
    const key = Symbol('value');
    const hasSymbolValue = hasProperties({ [key]: isNumberGuard });

    assert.strictEqual(hasSymbolValue({ [key]: 1 }), true);
    assert.strictEqual(hasSymbolValue({ [key]: 'one' }), false);
    assert.strictEqual(hasSymbolValue({}), false);
  });

  it('should return false for non-object-like values', () => {
    assert.strictEqual(isPoint(null), false);
    assert.strictEqual(isPoint(5), false);
  });

  it('should set a default expectation', () => {
    assert.strictEqual(isPoint.expectation, 'have specified properties');
  });
});
