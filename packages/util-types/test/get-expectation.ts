// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getExpectation } from '../src/get-expectation';
import type { Validator } from '../src/types';

describe(getExpectation.name, () => {
  it('should extract the expectation from a guard', () => {
    assert.strictEqual(
      getExpectation(() => true),
      'match assertion'
    );

    assert.strictEqual(
      getExpectation(function isFoo() {
        return true;
      }),
      "match 'isFoo'"
    );

    const guard = (): boolean => true;
    (guard as Validator).expectation = 'be something';
    assert.strictEqual(getExpectation(guard), 'be something');
  });

  it('should call a lazy expectation each time without replacing it', () => {
    let target = 1;
    const guard = (): boolean => true;
    const lazy = (): string => `equal ${target}`;
    (guard as Validator).expectation = lazy;
    Object.freeze(guard);

    assert.strictEqual(getExpectation(guard), 'equal 1');
    target = 2;
    assert.strictEqual(getExpectation(guard), 'equal 2');
    assert.strictEqual((guard as Validator).expectation, lazy);
  });
});
