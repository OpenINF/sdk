// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hasInterface } from '../../src/guards/has-interface';
import { isArray } from '../../src/guards/is-array';
import { isFunction } from '../../src/guards/is-function';
import { isNumber } from '../../src/guards/is-number';
import { isString } from '../../src/guards/is-string';

interface Point {
  x: number;
  y: number;
}

function checkInterfaceTypes(optional: { x?: number }): void {
  // @ts-expect-error A finite validator map cannot establish an index signature.
  hasInterface<Record<string, string>>('Dictionary', { title: isString });
  // @ts-expect-error Numeric index signatures also require unbounded validation.
  hasInterface<Record<number, string>>('NumberDictionary', {});
  // @ts-expect-error Symbol index signatures also require unbounded validation.
  hasInterface<Record<symbol, string>>('SymbolDictionary', {});
  // @ts-expect-error A template index signature is still an unbounded set of keys.
  hasInterface<Record<`data-${string}`, string>>('DataDictionary', {});
  // @ts-expect-error Property validators cannot establish a call signature.
  hasInterface<{ (): string; name: string }>('Factory', { name: isString });
  // @ts-expect-error Property validators cannot establish a constructor signature.
  hasInterface<new (name: string) => Point>('Constructor', {});
  // @ts-expect-error Checking one variant must not exclude all variants on failure.
  hasInterface<{ x: number } | { y: number }>('Union', { x: isNumber });
  // @ts-expect-error No object can be proven to have the never type.
  hasInterface<never>('Never', {});
  hasInterface<{ names: string[] }>('Names', {
    // @ts-expect-error Array membership does not establish string elements.
    names: isArray,
  });
  hasInterface<{ name(): string }>('Named', {
    // @ts-expect-error Function membership does not establish a return type.
    name: isFunction,
  });

  const hasX = hasInterface<{ x?: number }>('RequiredX', { x: isNumber });
  if (hasX(optional)) {
    const x: number = optional.x;
    void x;
  } else {
    // @ts-expect-error An interface with an absent optional property can fail.
    const impossible: never = optional;
    void impossible;
  }
}
void checkInterfaceTypes;

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

  it('should accept a function that implements the interface', () => {
    const pointClass = Object.assign(function Point() {}, { x: 0, y: 0 });
    assert.strictEqual(isPoint(pointClass), true);
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

  it('should require optional properties and validate their present values', () => {
    const hasX = hasInterface<{ x?: number }>('RequiredX', { x: isNumber });
    assert.strictEqual(hasX({}), false);
    assert.strictEqual(hasX({ x: undefined }), false);
    assert.strictEqual(hasX({ x: 1 }), true);
  });

  it('should check symbols and inherited properties of finite interfaces', () => {
    const key = Symbol('key');
    const hasKey = hasInterface<{ [key]: number }>('HasKey', {
      [key]: isNumber,
    });
    assert.strictEqual(hasKey(Object.create({ [key]: 1 })), true);
    assert.strictEqual(hasKey({ [key]: 'one' }), false);
  });

  it('should include validators declared on a map prototype', () => {
    class PointValidators {
      public get x(): typeof isNumber {
        return isNumber;
      }

      public get y(): typeof isNumber {
        return isNumber;
      }
    }
    const isPointFromClass = hasInterface<Point>(
      'Point',
      new PointValidators()
    );

    assert.strictEqual(isPointFromClass({ x: 1, y: 2 }), true);
    assert.strictEqual(isPointFromClass({ x: 'bad', y: false }), false);
  });

  it('should set the expectation to reference the interface name', () => {
    assert.strictEqual(isPoint.expectation, "implement 'Point'");
  });
});
