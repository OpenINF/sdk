// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isStringNotContaining } from '../../src/guards/is-string-not-containing';

describe(isStringNotContaining.name, () => {
  const isStringNotContainingFoo = isStringNotContaining('foo');

  it('should detect a string not containing the substring', () => {
    assert.strictEqual(isStringNotContainingFoo('barbaz'), true);
  });

  it('should reject a string containing the substring', () => {
    assert.strictEqual(isStringNotContainingFoo('foobar'), false);
  });

  it('should reject non-string values', () => {
    assert.strictEqual(isStringNotContainingFoo(42), false);
  });

  it('should set an expectation describing the substring', () => {
    const expectation = isStringNotContainingFoo.expectation as () => string;
    assert.strictEqual(expectation(), "not contain 'foo'");
  });
});
