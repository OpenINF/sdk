// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNull } from '../../src/guards/is-null';

describe(isNull.name, () => {
  it('should detect null', () => {
    assert.strictEqual(isNull(null), true);
  });

  it('should reject non-null values', () => {
    assert.strictEqual(isNull(NaN), false);
    assert.strictEqual(isNull(undefined), false);
    assert.strictEqual(isNull(0), false);
  });

  it('should narrow to null', () => {
    const values: (string | null)[] = ['text', null];
    const lengths = values.map((value) =>
      // Compiles only if isNull narrowed `value` to string in the else branch.
      isNull(value) ? -1 : value.length
    );
    assert.deepStrictEqual(lengths, [4, -1]);
  });
});
