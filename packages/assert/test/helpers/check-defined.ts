// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { checkDefined } from '../../src/helpers/check-defined';

describe(checkDefined.name, () => {
  it('should return the value when it is defined', () => {
    assert.strictEqual(checkDefined(5), 5);
    assert.strictEqual(checkDefined(''), '');
  });

  it('should throw when the value is undefined', () => {
    assert.throws(() => checkDefined(undefined));
  });

  it('should throw when the value is null', () => {
    assert.throws(() => checkDefined(null));
  });

  it('should use a custom message when provided', () => {
    assert.throws(() => checkDefined(null, 'custom message'), /custom message/);
  });
});
