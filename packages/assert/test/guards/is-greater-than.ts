// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { Guard } from '@openinf/util-core';

import { isGreaterThan } from '../../src/guards/is-greater-than';

function comparableReturning(result: -1 | 0 | 1): { compareTo(): -1 | 0 | 1 } {
  return { compareTo: () => result };
}

describe(isGreaterThan.name, () => {
  it('should use numeric comparison for plain values', () => {
    const guard = isGreaterThan(5);
    assert.strictEqual(guard(6), true);
    assert.strictEqual(guard(5), false);
    assert.strictEqual(guard(4), false);
  });

  it('should reject values that relational comparison would coerce', () => {
    const validator = isGreaterThan(1);
    assert.strictEqual(validator('2'), false);
    assert.strictEqual(validator(true), false);
  });

  it('should be a validator rather than an unsound type guard', () => {
    // @ts-expect-error -- comparison alone cannot establish a value's type.
    const guard: Guard<number> = isGreaterThan(1);
    assert.strictEqual(guard(2), true);
  });

  it("should use a Comparable's compareTo method", () => {
    const guard = isGreaterThan(0);
    assert.strictEqual(guard(comparableReturning(1)), true);
    assert.strictEqual(guard(comparableReturning(0)), false);
    assert.strictEqual(guard(comparableReturning(-1)), false);
  });
});
