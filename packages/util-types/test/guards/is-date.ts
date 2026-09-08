// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isDate } from '../../src/guards/is-date';

describe(isDate.name, () => {
  it('should detect a Date instance', () => {
    assert.strictEqual(isDate(new Date(91, 1)), true);
  });

  // A type check, not a validity check: an Invalid Date is still a Date.
  // Matches node:util's types.isDate, which this package mirrors.
  it('should accept an Invalid Date', () => {
    assert.strictEqual(isDate(new Date(NaN)), true);
    assert.strictEqual(isDate(new Date('nope')), true);
  });

  it('should reject a date-like string', () => {
    assert.strictEqual(isDate('Sun February 28 2021'), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isDate(null), false);
  });
});
