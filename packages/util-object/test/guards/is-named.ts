// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNamed } from '../../src/guards/is-named';

describe(isNamed.name, () => {
  it('should detect a value with a string name', () => {
    assert.strictEqual(isNamed({ name: 'Derek' }), true);
  });

  it('should reject a value with a non-string name', () => {
    assert.strictEqual(isNamed({ name: 1000 }), false);
    assert.strictEqual(isNamed({ name: undefined }), false);
  });

  it('should reject a value with no name property', () => {
    assert.strictEqual(isNamed({}), false);
  });

  it('should reject non-objects', () => {
    assert.strictEqual(isNamed(null), false);
    assert.strictEqual(isNamed(42), false);
  });
});
