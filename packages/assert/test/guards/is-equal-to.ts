// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isEqualTo } from '../../src/guards/is-equal-to';

describe(isEqualTo.name, () => {
  it('should compare primitives with strict equality', () => {
    const guard = isEqualTo(1);
    assert.strictEqual(guard(1), true);
    assert.strictEqual(guard(2), false);
  });

  it("should delegate to an Equatable's equals method", () => {
    const equatable = { equals: (other: unknown) => other === 'x' };
    const guard = isEqualTo(equatable);
    assert.strictEqual(guard('x'), true);
    assert.strictEqual(guard('y'), false);
  });
});
