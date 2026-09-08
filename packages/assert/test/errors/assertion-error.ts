// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { AssertionError } from '../../src/errors/assertion-error';

describe(AssertionError.name, () => {
  it('should default to a generic message with no options', () => {
    const error = new AssertionError();
    assert.strictEqual(error.message, 'Assertion failed');
  });

  it('should use a provided message', () => {
    const error = new AssertionError('custom message');
    assert.strictEqual(error.message, 'custom message');
  });

  it('should generate a message from actual/expected/operator', () => {
    const error = new AssertionError(undefined, {
      actual: 1,
      expected: 2,
      operator: '===',
    });
    assert.strictEqual(error.message, 'Expected 1 === 2');
  });

  it('should set actual, expected, operator, code, and name', () => {
    const error = new AssertionError('msg', {
      actual: 1,
      expected: 2,
      operator: '===',
    });
    assert.strictEqual(error.actual, 1);
    assert.strictEqual(error.expected, 2);
    assert.strictEqual(error.operator, '===');
    assert.strictEqual(error.code, 'ERR_ASSERTION');
    assert.strictEqual(error.name, 'AssertionError');
    assert.ok(error instanceof Error);
  });

  it('should format toString with name, code, and message', () => {
    const error = new AssertionError('boom');
    assert.strictEqual(
      error.toString(),
      'AssertionError [ERR_ASSERTION]: boom'
    );
  });
});
