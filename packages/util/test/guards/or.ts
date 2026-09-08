// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNumber, isUndefined } from '@openinf/util-core';

import { or } from '../../src/guards/or';

describe(or.name, () => {
  const isNumberOrUndefined = or(isNumber, isUndefined);

  it('should return true when any guard passes', () => {
    assert.strictEqual(isNumberOrUndefined(1), true);
    assert.strictEqual(isNumberOrUndefined(undefined), true);
  });

  it('should return false when every guard fails', () => {
    assert.strictEqual(isNumberOrUndefined('1'), false);
  });

  it('should combine expectations from all guards', () => {
    const expectation =
      typeof isNumberOrUndefined.expectation === 'function'
        ? isNumberOrUndefined.expectation()
        : isNumberOrUndefined.expectation;
    assert.strictEqual(
      expectation,
      'be a number or be of primitive type `undefined`'
    );
  });
});
