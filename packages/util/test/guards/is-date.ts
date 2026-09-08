// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isDate } from '../../src/guards/is-date';

describe(isDate.name, () => {
  it('should detect Dates', () => {
    assert.strictEqual(isDate(new Date()), true);
    assert.strictEqual(isDate(new Date(91, 1)), true);
  });

  it('should reject non-Dates', () => {
    assert.strictEqual(isDate('Sun February 28 2021'), false);
    assert.strictEqual(isDate(null), false);
    assert.strictEqual(isDate({}), false);
  });
});
