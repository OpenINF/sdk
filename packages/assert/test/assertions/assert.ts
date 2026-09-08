// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';

import { assert as assertFn } from '../../src/assertions/assert';

describe(assertFn.name, () => {
  it('should not throw when the expression is exactly true', () => {
    assert.doesNotThrow(() => assertFn(true));
  });

  it('should throw when the expression is not exactly true', () => {
    assert.throws(() => assertFn(false), /Assertion failed/);
    assert.throws(() => assertFn(1));
    assert.throws(() => assertFn('truthy'));
  });

  it('should use a custom message when provided', () => {
    assert.throws(() => assertFn(false, 'custom message'), /custom message/);
  });

  it('should lazily evaluate a message function only on failure', () => {
    const msgFn = mock.fn(() => 'lazy message');
    assert.doesNotThrow(() => assertFn(true, msgFn));
    assert.strictEqual(msgFn.mock.callCount(), 0);

    assert.throws(() => assertFn(false, msgFn), /lazy message/);
    assert.strictEqual(msgFn.mock.callCount(), 1);
  });
});
