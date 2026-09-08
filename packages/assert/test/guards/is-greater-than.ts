// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

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

  it("should use a Comparable's compareTo method", () => {
    const guard = isGreaterThan(0);
    assert.strictEqual(guard(comparableReturning(1)), true);
    assert.strictEqual(guard(comparableReturning(0)), false);
    assert.strictEqual(guard(comparableReturning(-1)), false);
  });
});
