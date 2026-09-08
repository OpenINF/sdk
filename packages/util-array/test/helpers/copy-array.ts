// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { copyArray } from '../../src/helpers/copy-array';

describe(copyArray.name, () => {
  it('should return a new array with the same primitive elements', () => {
    const original = [1, 'two', true, null];
    const copy = copyArray(original);
    assert.deepStrictEqual(copy, original);
    assert.notStrictEqual(copy, original);
  });

  it('should deep-copy nested arrays', () => {
    const original = [
      [1, 2],
      [3, 4],
    ];
    const copy = copyArray(original);
    assert.deepStrictEqual(copy, original);
    copy[0]?.push(99);
    assert.deepStrictEqual(original[0], [1, 2]);
  });

  it('should deep-copy plain objects', () => {
    const original = [{ a: 1, nested: { b: 2 } }];
    const copy = copyArray(original);
    assert.deepStrictEqual(copy, original);
    (copy[0] as { nested: { b: number } }).nested.b = 99;
    assert.strictEqual(original[0]?.nested.b, 2);
  });

  it('should copy non-plain objects by reference', () => {
    class Foo {
      public constructor(public value: number) {}
    }
    const instance = new Foo(1);
    const [copy] = copyArray([instance]);
    assert.strictEqual(copy, instance);
  });

  it('should only copy own properties by default', () => {
    Object.defineProperty(Object.prototype, '__testInherited__', {
      value: 'inherited',
      configurable: true,
      enumerable: true,
      writable: true,
    });
    try {
      const [copy] = copyArray([{ own: true }], false);
      assert.deepStrictEqual(copy, { own: true });
    } finally {
      delete (Object.prototype as Record<string, unknown>)['__testInherited__'];
    }
  });

  it('should include inherited enumerable properties when requested', () => {
    Object.defineProperty(Object.prototype, '__testInherited__', {
      value: 'inherited',
      configurable: true,
      enumerable: true,
      writable: true,
    });
    try {
      const [copy] = copyArray([{ own: true }], true) as Record<
        string,
        unknown
      >[];
      assert.strictEqual(copy?.['own'], true);
      assert.strictEqual(copy?.['__testInherited__'], 'inherited');
    } finally {
      delete (Object.prototype as Record<string, unknown>)['__testInherited__'];
    }
  });
});

describe('copyArray prototype pollution', () => {
  it('should not let a __proto__ key reach the copy’s prototype', () => {
    const payload = JSON.parse(
      '{"__proto__":{"POLLUTED":"yes"},"safe":"kept"}'
    ) as Record<string, unknown>;

    const [copied] = copyArray([payload]);

    assert.strictEqual(({} as Record<string, unknown>)['POLLUTED'], undefined);
    assert.strictEqual(Object.getPrototypeOf(copied), Object.prototype);
    assert.deepStrictEqual(copied, { safe: 'kept' });
  });
});
