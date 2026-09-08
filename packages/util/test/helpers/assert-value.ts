// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNumber, isString } from '@openinf/util-core';

import { assertValue } from '../../src/helpers/assert-value';

describe(assertValue.name, () => {
  it('should not throw when the value satisfies the guard', () => {
    assert.doesNotThrow(() => assertValue(isNumber, 1));
  });

  it('should throw an AssertionError when the value fails the guard', () => {
    assert.throws(
      () => assertValue(isString, 1),
      /Expected value to be a String primitive or object but received: 1/
    );
  });

  it('should use the provided name in the error message', () => {
    assert.throws(
      () => assertValue(isString, 1, 'argName'),
      /Expected .argName. to be a String primitive or object but received: 1/
    );
  });
});
