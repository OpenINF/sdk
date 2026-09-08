// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { generateArgumentErrorMessage } from '../../src/helpers/generate-argument-error-message';

describe(generateArgumentErrorMessage.name, () => {
  it('should return the bare message for a single predicate with a single error', () => {
    const errors = new Map([['isString', new Set(['must be a string'])]]);
    assert.strictEqual(
      generateArgumentErrorMessage(errors),
      'must be a string'
    );
  });

  it('should bullet a single predicate with a single error when isAny is true', () => {
    const errors = new Map([['isString', new Set(['must be a string'])]]);
    assert.strictEqual(
      generateArgumentErrorMessage(errors, true),
      '  - must be a string'
    );
  });

  it('should enumerate a single predicate with multiple errors', () => {
    const errors = new Map([
      ['isNumber', new Set(['must be a number', 'must be positive'])],
    ]);
    assert.strictEqual(
      generateArgumentErrorMessage(errors),
      'must be a number\nmust be positive'
    );
  });

  it('should bullet every entry when multiple predicates each have one error', () => {
    const errors = new Map([
      ['isString', new Set(['err1'])],
      ['isNumber', new Set(['err2'])],
    ]);
    assert.strictEqual(
      generateArgumentErrorMessage(errors),
      '  - err1\n  - err2'
    );
  });

  it('should group by predicate when any predicate has multiple errors', () => {
    const errors = new Map([
      ['isString', new Set(['err1'])],
      ['isNumber', new Set(['err2a', 'err2b'])],
    ]);
    assert.strictEqual(
      generateArgumentErrorMessage(errors),
      'Errors from the "isString" predicate:\n' +
        '  - err1\n' +
        'Errors from the "isNumber" predicate:\n' +
        '  - err2a\n' +
        '  - err2b'
    );
  });
});
