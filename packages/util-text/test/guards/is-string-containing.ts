// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isStringContaining } from '../../src/guards/is-string-containing';

describe(isStringContaining.name, () => {
  const isStringContainingFoo = isStringContaining('foo');

  it('should detect a string containing the substring', () => {
    assert.strictEqual(isStringContainingFoo('foobar'), true);
  });

  it('should reject a string not containing the substring', () => {
    assert.strictEqual(isStringContainingFoo('barbaz'), false);
  });

  it('should reject non-string values', () => {
    assert.strictEqual(isStringContainingFoo(42), false);
  });

  it('should set an expectation describing the substring', () => {
    const expectation = isStringContainingFoo.expectation as () => string;
    assert.strictEqual(expectation(), "contain 'foo'");
  });
});
