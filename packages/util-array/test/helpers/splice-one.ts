// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { spliceOne } from '../../src/helpers/splice-one';

describe(spliceOne.name, () => {
  it('should remove the element at the given index', () => {
    const list = [1, 2, 3];
    spliceOne(list, 1);
    assert.deepStrictEqual(list, [1, 3]);
  });

  it('should remove the last element', () => {
    const list = [1, 2, 3];
    spliceOne(list, 2);
    assert.deepStrictEqual(list, [1, 2]);
  });

  it('should remove the first element', () => {
    const list = [1, 2, 3];
    spliceOne(list, 0);
    assert.deepStrictEqual(list, [2, 3]);
  });

  it('should reject indices that do not identify an element', () => {
    for (const index of [-1, 3, 1.5, Number.NaN]) {
      const list = [1, 2, 3];
      assert.throws(() => spliceOne(list, index), RangeError);
      assert.deepStrictEqual(list, [1, 2, 3]);
    }
  });

  it('should not fill a hole from the array prototype', () => {
    // `in` answers for the prototype chain, so a numeric property there would
    // be read as an element and copied over the hole it stands in for.
    const list = [0, 1];
    list.length = 3;
    Object.defineProperty(Array.prototype, '2', {
      value: 'from prototype',
      configurable: true,
    });

    try {
      spliceOne(list, 0);
      assert.strictEqual(Object.hasOwn(list, 1), false);
    } finally {
      Reflect.deleteProperty(Array.prototype, '2');
    }
  });

  it('should preserve holes when shifting sparse elements', () => {
    const list = [1, , 3];
    spliceOne(list, 0);

    assert.strictEqual(list.length, 2);
    assert.strictEqual(Object.hasOwn(list, 0), false);
    assert.strictEqual(list[1], 3);
  });
});
