// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isDate } from '../../src/guards/is-date';
import { isValidDate } from '../../src/guards/is-valid-date';

describe(isValidDate.name, () => {
  it('should accept a Date with a usable time value', () => {
    assert.strictEqual(isValidDate(new Date()), true);
    assert.strictEqual(isValidDate(new Date(91, 1)), true);
    assert.strictEqual(isValidDate(new Date(0)), true);
  });

  // This is the whole point of the guard: isDate accepts these, isValidDate
  // does not. Mirrors @sindresorhus/is's is.date vs is.validDate split.
  it('should reject an Invalid Date that isDate accepts', () => {
    for (const invalid of [new Date(NaN), new Date('nope'), new Date('')]) {
      assert.strictEqual(isDate(invalid), true, 'isDate should accept it');
      assert.strictEqual(isValidDate(invalid), false);
    }
  });

  it('should reject values that are not Dates at all', () => {
    for (const value of ['Sun February 28 2021', 0, null, undefined, {}, []]) {
      assert.strictEqual(isValidDate(value), false);
    }
  });

  it('should carry an expectation for error messages', () => {
    assert.strictEqual(
      (isValidDate as unknown as { expectation: string }).expectation,
      'be a valid Date object'
    );
  });
});
