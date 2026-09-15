// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { arrayOf } from '../../src/helpers/array-of';

describe(arrayOf.name, () => {
  it('should build an array by invoking the factory for each index', () => {
    assert.deepStrictEqual(
      arrayOf(4, (i) => i * 2),
      [0, 2, 4, 6]
    );
  });

  it('should truncate a fractional count rather than write past it', () => {
    assert.deepStrictEqual(
      arrayOf(2.5, (i) => i),
      [0, 1]
    );
  });

  it('should not call the factory for a fractional count below one', () => {
    let calls = 0;
    assert.deepStrictEqual(
      arrayOf(0.5, (i) => {
        calls += 1;
        return i;
      }),
      []
    );
    assert.strictEqual(calls, 0);
  });

  it('should return an empty array for a negative or NaN count', () => {
    assert.deepStrictEqual(
      arrayOf(-1, (i) => i),
      []
    );
    assert.deepStrictEqual(
      arrayOf(Number.NaN, (i) => i),
      []
    );
  });

  it('should return an empty array for a count of zero', () => {
    assert.deepStrictEqual(
      arrayOf(0, (i) => i),
      []
    );
  });
});
