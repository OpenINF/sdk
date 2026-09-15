// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNonEmptyString } from '../../src/guards/is-non-empty-string';

describe(isNonEmptyString.name, () => {
  it('should detect a non-empty string', () => {
    assert.strictEqual(isNonEmptyString('foo'), true);
  });

  it('should reject an empty string', () => {
    assert.strictEqual(isNonEmptyString(''), false);
  });

  it('should reject non-string values', () => {
    assert.strictEqual(isNonEmptyString(0), false);
    assert.strictEqual(isNonEmptyString(null), false);
  });
});
