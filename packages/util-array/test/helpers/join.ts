// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { join } from '../../src/helpers/join';

describe(join.name, () => {
  it('should join elements with the given separator', () => {
    assert.strictEqual(join([1, 2, 3], '-'), '1-2-3');
  });

  it('should return an empty string for an empty array-like', () => {
    assert.strictEqual(join([], ','), '');
  });

  it('should return the sole element without a separator', () => {
    assert.strictEqual(join(['a'], ','), 'a');
  });
});
