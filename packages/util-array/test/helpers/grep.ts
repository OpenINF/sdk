// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { grep } from '../../src/helpers/grep';

describe(grep.name, () => {
  it('should keep elements for which the callback returns truthy', () => {
    assert.deepStrictEqual(
      grep([1, 2, 3, 4], (x) => x % 2 === 0),
      [2, 4]
    );
  });

  it('should keep elements for which the callback returns falsy when inverted', () => {
    assert.deepStrictEqual(
      grep([1, 2, 3, 4], (x) => x % 2 === 0, true),
      [1, 3]
    );
  });

  it('should return an empty array when nothing matches', () => {
    assert.deepStrictEqual(
      grep([1, 3, 5], (x) => x % 2 === 0),
      []
    );
  });
});
