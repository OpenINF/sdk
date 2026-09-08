// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { map } from '../../src/helpers/map';

describe(map.name, () => {
  it('should translate each element of an array-like', () => {
    assert.deepStrictEqual(
      map([1, 2, 3], (x) => x * 2),
      [2, 4, 6]
    );
  });

  it('should translate each own enumerable key of an object', () => {
    assert.deepStrictEqual(
      map({ a: 1, b: 2 }, (v, k) => `${k}:${v}`),
      ['a:1', 'b:2']
    );
  });

  it('should omit results that are null or undefined', () => {
    assert.deepStrictEqual(
      map<number, number | null>([1, 2, 3], (x) => (x === 2 ? null : x)),
      [1, 3]
    );
  });

  it('should flatten one level of nested arrays produced by the callback', () => {
    const result = map<number, number>(
      [1, 2],
      (x) => [x, x] as unknown as number
    );
    assert.deepStrictEqual(result, [1, 1, 2, 2]);
  });

  it('should pass the extra argument through to the callback', () => {
    assert.deepStrictEqual(
      map([1, 2], (x, _i, arg) => x + (arg as number), 10),
      [11, 12]
    );
  });
});
