// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertValue } from '../../src/assertions/assert-value';

/** Defined locally so these tests do not reach into another package. */
const isNumber = (value: unknown): value is number => typeof value === 'number';
// assertValue reads `.expectation` to build its message, as real guards carry.
(isNumber as unknown as { expectation: string }).expectation = 'be a number';

describe(assertValue.name, () => {
  it('should not throw when the value satisfies the guard', () => {
    assert.doesNotThrow(() => assertValue(isNumber, 1));
  });

  it('should throw when the value fails the guard', () => {
    assert.throws(
      () => assertValue(isNumber, 'x'),
      /Expected value to be a number but received: x/
    );
  });

  it('should use the provided name in the error message', () => {
    assert.throws(
      () => assertValue(isNumber, 'x', 'myVar'),
      /Expected .myVar. to be a number but received: x/
    );
  });

  it('should use the provided expectation to override the default', () => {
    assert.throws(
      () => assertValue(isNumber, 'x', 'myVar', 'be a numeric value'),
      /Expected .myVar. to be a numeric value but received: x/
    );
  });

  it('should support a validator factory', () => {
    const factory = (): typeof isNumber => isNumber;
    assert.doesNotThrow(() => assertValue(factory, 5));
    assert.throws(() => assertValue(factory, 'x'));
  });

  it('should truncate long values in the error message', () => {
    const longStr = 'a'.repeat(200);
    assert.throws(() => assertValue(isNumber, longStr), /\.\.\.$/);
  });

  it('should JSON.stringify plain objects', () => {
    assert.throws(() => assertValue(isNumber, { a: 1 }), /received: \{"a":1\}/);
  });
});
