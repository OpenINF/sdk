// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { merge } from '../../src/helpers/merge';

describe(merge.name, () => {
  it('should append the second array onto the first', () => {
    const first = [1, 2];
    const result = merge(first, [3, 4]);
    assert.deepStrictEqual(result, [1, 2, 3, 4]);
  });

  it('should mutate and return the first array', () => {
    const first = [1, 2];
    const result = merge(first, [3, 4]);
    assert.strictEqual(result, first);
  });

  it('should handle an empty second array', () => {
    assert.deepStrictEqual(merge([1, 2], []), [1, 2]);
  });
});
