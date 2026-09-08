// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNumberObject } from '../../src/guards/is-number-object';

describe(isNumberObject.name, () => {
  it('should detect a boxed Number object', () => {
    assert.strictEqual(isNumberObject(Object(123)), true);
  });

  it('should reject a number primitive', () => {
    assert.strictEqual(isNumberObject(123), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isNumberObject(null), false);
  });
});
