// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hasInterface } from '../../src/guards/has-interface';

interface Point {
  x: number;
  y: number;
}

describe(hasInterface.name, () => {
  const isPoint = hasInterface<Point>('Point', {
    x: (value): value is number => typeof value === 'number',
    y: (value): value is number => typeof value === 'number',
  });

  it('should detect a value implementing the interface', () => {
    assert.strictEqual(isPoint({ x: 1, y: 2 }), true);
  });

  it('should reject a value missing a property', () => {
    assert.strictEqual(isPoint({ x: 1 }), false);
  });

  it('should reject a value with a mismatched property type', () => {
    assert.strictEqual(isPoint({ x: 1, y: 'two' }), false);
  });

  it('should resolve and apply validators-producing functions', () => {
    let resolutions = 0;
    const isLazyPoint = hasInterface<Point>('Point', () => {
      resolutions++;
      return {
        x: (value): value is number => typeof value === 'number',
        y: (value): value is number => typeof value === 'number',
      };
    });

    assert.strictEqual(isLazyPoint({ x: 1, y: 2 }), true);
    assert.strictEqual(isLazyPoint({ x: 1, y: 'two' }), false);
    assert.strictEqual(isLazyPoint({}), false);
    assert.strictEqual(resolutions, 3);
  });

  it('should require a property even when its validator accepts undefined', () => {
    const hasValue = hasInterface<{ value: undefined }>('HasValue', {
      value: (value): value is undefined => value === undefined,
    });

    assert.strictEqual(hasValue({ value: undefined }), true);
    assert.strictEqual(hasValue({}), false);
  });

  it('should set an expectation describing the interface', () => {
    assert.strictEqual(isPoint.expectation, "implement 'Point'");
  });
});
