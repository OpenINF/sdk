// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Assert } from '../../src/assertions/assert-decorator';

/** Defined locally so these tests do not reach into another package. */
const isNumber = (value: unknown): value is number => typeof value === 'number';
// assertValue reads `.expectation` to build its message, as real guards carry.
(isNumber as unknown as { expectation: string }).expectation = 'be a number';

describe(Assert.name, () => {
  it('should validate an auto-accessor initializer', () => {
    assert.throws(() => {
      class Invalid {
        @Assert(isNumber)
        accessor value: unknown = 'nope';
      }

      return new Invalid();
    }, /Invalid#value/);
  });

  it('should validate every later assignment', () => {
    class Counter {
      @Assert(isNumber)
      accessor value: unknown = 0;
    }

    const counter = new Counter();
    assert.doesNotThrow(() => (counter.value = 5));
    assert.strictEqual(counter.value, 5);
    assert.throws(() => (counter.value = 'nope'));
    assert.strictEqual(counter.value, 5);
  });

  it('should use a custom name and expectation', () => {
    class Counter {
      @Assert(isNumber, 'count', 'contain a numeric count')
      accessor value: unknown = 0;
    }

    const counter = new Counter();
    assert.throws(
      () => (counter.value = 'nope'),
      /Expected .count. to contain a numeric count/
    );
  });

  it('should validate static auto-accessors', () => {
    class Counter {
      @Assert(isNumber)
      static accessor value: unknown = 0;
    }

    assert.throws(() => (Counter.value = 'nope'), /Counter\.value/);
  });

  it('should stack multiple decorators on the same accessor', () => {
    const isPositive = (value: unknown): boolean => (value as number) > 0;
    class Counter {
      @Assert(isNumber)
      @Assert(isPositive)
      accessor value: unknown = 1;
    }

    const counter = new Counter();
    assert.throws(() => (counter.value = -1));
    assert.throws(() => (counter.value = 'nope'));
    assert.doesNotThrow(() => (counter.value = 5));
  });

  it('should keep validation on an inherited accessor', () => {
    class Base {
      @Assert(isNumber)
      accessor value: unknown = 0;
    }
    class Child extends Base {}

    const child = new Child();
    assert.throws(() => (child.value = 'nope'), /Child#value/);
  });

  it('should reject an accessor left without an initializer', () => {
    class Uninitialized {
      @Assert(isNumber)
      accessor value!: unknown;

      constructor(value: unknown) {
        this.value = value;
      }
    }

    // The initializer runs before the constructor body, so assigning a valid
    // value there does not save an accessor whose implied `undefined` is
    // rejected. The documented way out is a validator that accepts it.
    assert.throws(() => new Uninitialized(1), /Uninitialized#value/);
  });

  it('should distinguish symbol-named accessors', () => {
    const first = Symbol('value');
    const second = Symbol('value');
    class Pair {
      @Assert(isNumber)
      accessor [first]: unknown = 1;

      @Assert((value) => typeof value === 'string')
      accessor [second]: unknown = 'two';
    }

    const pair = new Pair();
    assert.throws(() => (pair[first] = 'nope'));
    assert.throws(() => (pair[second] = 2));
  });
});
