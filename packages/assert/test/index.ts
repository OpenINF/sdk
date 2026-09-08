// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as assertPkg from '../src/index';

describe('index', () => {
  it('should export every public assertion, guard, and helper as a function', () => {
    const names = [
      'Assert',
      'assertEqual',
      'assertGreaterThanOrEqual',
      'assertIsDefined',
      'assertLessThanOrEqual',
      'assertLessThan',
      'assertUnreachable',
      'assertValue',
      'assert',
      'isComparable',
      'isDeepEqualTo',
      'isEqualTo',
      'isEquatable',
      'isGreaterThanOrEqualTo',
      'isGreaterThan',
      'isIdenticalTo',
      'isLessThanOrEqualTo',
      'isLessThan',
      'isMatch',
      'checkDefined',
    ] as const;

    for (const name of names) {
      assert.strictEqual(typeof assertPkg[name], 'function');
    }
  });

  it('should export the AssertionError class', () => {
    assert.notStrictEqual(assertPkg.AssertionError, undefined);
    assert.ok(new assertPkg.AssertionError('x') instanceof Error);
  });

  it('should agree with its exports on a representative value', () => {
    assert.doesNotThrow(() => assertPkg.assert(true));
    assert.strictEqual(assertPkg.isEqualTo(1)(1), true);
  });
});
