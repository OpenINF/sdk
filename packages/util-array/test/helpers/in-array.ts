// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { inArray } from '../../src/helpers/in-array';

describe(inArray.name, () => {
  it('should return the index of the element when present', () => {
    assert.strictEqual(inArray(2, [1, 2, 3], 0), 1);
  });

  it('should return -1 when the element is absent', () => {
    assert.strictEqual(inArray(5, [1, 2, 3], 0), -1);
  });

  it('should return -1 for a nullish array', () => {
    assert.strictEqual(inArray(1, null, 0), -1);
    assert.strictEqual(inArray(1, undefined, 0), -1);
  });

  it('should respect the starting index', () => {
    assert.strictEqual(inArray(1, [1, 2, 1], 1), 2);
  });
});
