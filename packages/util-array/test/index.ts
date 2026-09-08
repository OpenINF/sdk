// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as utilArray from '../src/index';

describe('index', () => {
  it('should export every public guard and helper as a function', () => {
    const names = [
      'arrayIsHomogeneous',
      'equateValues',
      'isArrayLike',
      'arrayOf',
      'arraysEqual',
      'assocIndexOf',
      'contains',
      'copyArray',
      'grep',
      'inArray',
      'join',
      'map',
      'merge',
      'pushIfUnique',
      'spliceOne',
      'toArray',
    ] as const;

    for (const name of names) {
      assert.strictEqual(typeof utilArray[name], 'function');
    }
  });

  it('should agree with its exports on a representative value', () => {
    assert.strictEqual(utilArray.isArrayLike([1, 2, 3]), true);
    assert.deepStrictEqual(utilArray.toArray('a'), ['a']);
    assert.strictEqual(utilArray.arraysEqual([1, 2], [1, 2]), true);
  });
});
