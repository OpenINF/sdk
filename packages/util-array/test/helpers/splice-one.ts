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
});
