// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNumber } from '@openinf/util-core';

import { hasInterface } from '../../src/guards/has-interface';

interface Point {
  x: number;
  y: number;
}

describe(hasInterface.name, () => {
  const isPoint = hasInterface<Point>('Point', {
    x: isNumber,
    y: isNumber,
  });

  it('should return true when the value implements the interface', () => {
    assert.strictEqual(isPoint({ x: 0, y: 0 }), true);
  });

  it('should return false when a property fails validation', () => {
    assert.strictEqual(isPoint({ x: 0, y: 'not a number' }), false);
    assert.strictEqual(isPoint({ x: 0 }), false);
  });

  it('should return false for non-objects', () => {
    assert.strictEqual(isPoint(null), false);
    assert.strictEqual(isPoint(42), false);
  });

  it('should support a validators-producing function', () => {
    const isPointLazy = hasInterface<Point>('Point', () => ({
      x: isNumber,
      y: isNumber,
    }));
    assert.strictEqual(isPointLazy({ x: 1, y: 2 }), true);
    assert.strictEqual(isPointLazy({ x: 1, y: 'two' }), false);
    assert.strictEqual(isPointLazy({}), false);
  });

  it('should require a property even when its validator accepts undefined', () => {
    const hasValue = hasInterface<{ value: undefined }>('HasValue', {
      value: (value): value is undefined => value === undefined,
    });

    assert.strictEqual(hasValue({ value: undefined }), true);
    assert.strictEqual(hasValue({}), false);
  });

  it('should set the expectation to reference the interface name', () => {
    assert.strictEqual(isPoint.expectation, "implement 'Point'");
  });
});
