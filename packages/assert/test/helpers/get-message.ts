// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getMessage } from '../../src/helpers/get-message';

describe(getMessage.name, () => {
  it('should return a generic message when no operator is given', () => {
    assert.strictEqual(getMessage({}), 'Assertion failed');
  });

  it('should include the inspected actual, operator, and expected values', () => {
    assert.strictEqual(
      getMessage({ actual: 1, expected: 2, operator: '===' }),
      'Expected 1 === 2'
    );
  });

  it('should inspect string values with quotes', () => {
    assert.strictEqual(
      getMessage({ actual: 'a', expected: 'b', operator: '===' }),
      "Expected 'a' === 'b'"
    );
  });
});
