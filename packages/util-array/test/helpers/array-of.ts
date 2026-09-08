// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { arrayOf } from '../../src/helpers/array-of';

describe(arrayOf.name, () => {
  it('should build an array by invoking the factory for each index', () => {
    assert.deepStrictEqual(
      arrayOf(4, (i) => i * 2),
      [0, 2, 4, 6]
    );
  });

  it('should return an empty array for a count of zero', () => {
    assert.deepStrictEqual(
      arrayOf(0, (i) => i),
      []
    );
  });
});
