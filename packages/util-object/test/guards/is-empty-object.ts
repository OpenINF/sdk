// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isEmptyObject } from '../../src/guards/is-empty-object';

describe(isEmptyObject.name, () => {
  it('should return true for an object with no enumerable properties', () => {
    assert.strictEqual(isEmptyObject({}), true);
  });

  it('should return false for an object with an enumerable property', () => {
    assert.strictEqual(isEmptyObject({ a: 1 }), false);
  });
});
