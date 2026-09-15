// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isBooleanObject } from '../../src/guards/is-boolean-object';

describe(isBooleanObject.name, () => {
  it('should detect a boxed Boolean object', () => {
    assert.strictEqual(isBooleanObject(new Boolean(false)), true);
  });

  it('should reject boolean primitives', () => {
    assert.strictEqual(isBooleanObject(true), false);
    assert.strictEqual(isBooleanObject(false), false);
  });

  it('should reject non-boolean values', () => {
    assert.strictEqual(isBooleanObject(0), false);
    assert.strictEqual(isBooleanObject(null), false);
  });
});
