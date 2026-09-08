// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getOwnValues } from '../../src/helpers/get-own-values';

describe(getOwnValues.name, () => {
  it('should return the values of a dense array', () => {
    assert.deepStrictEqual(getOwnValues([1, 2, 3]), [1, 2, 3]);
  });

  it('should skip holes in a sparse array', () => {
    const sparse = [1, , 3];
    assert.deepStrictEqual(getOwnValues(sparse), [1, 3]);
  });
});
