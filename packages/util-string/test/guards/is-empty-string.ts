// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isEmptyString } from '../../src/guards/is-empty-string';

describe(isEmptyString.name, () => {
  it('should detect an empty string', () => {
    assert.strictEqual(isEmptyString(''), true);
  });

  it('should reject a non-empty string', () => {
    assert.strictEqual(isEmptyString('foo'), false);
  });

  it('should reject non-string values', () => {
    assert.strictEqual(isEmptyString(0), false);
    assert.strictEqual(isEmptyString(null), false);
  });
});
