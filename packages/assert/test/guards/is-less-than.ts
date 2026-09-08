// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isLessThan } from '../../src/guards/is-less-than';

function comparableReturning(result: -1 | 0 | 1): { compareTo(): -1 | 0 | 1 } {
  return { compareTo: () => result };
}

describe(isLessThan.name, () => {
  it('should use numeric comparison for plain values', () => {
    const guard = isLessThan(5);
    assert.strictEqual(guard(4), true);
    assert.strictEqual(guard(5), false);
    assert.strictEqual(guard(6), false);
  });

  it("should use a Comparable's compareTo method", () => {
    const guard = isLessThan(0);
    assert.strictEqual(guard(comparableReturning(-1)), true);
    assert.strictEqual(guard(comparableReturning(0)), false);
    assert.strictEqual(guard(comparableReturning(1)), false);
  });
});
