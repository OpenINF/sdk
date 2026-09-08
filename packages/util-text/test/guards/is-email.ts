// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isEmail } from '../../src/guards/is-email';

describe(isEmail.name, () => {
  it('should detect a syntactically valid email address', () => {
    assert.strictEqual(isEmail('foo@example.com'), true);
  });

  it('should reject a string missing a domain', () => {
    assert.strictEqual(isEmail('foo@'), false);
  });

  it('should reject a string missing the @ symbol', () => {
    assert.strictEqual(isEmail('foo.example.com'), false);
  });

  it('should reject non-string values', () => {
    assert.strictEqual(isEmail(42), false);
    assert.strictEqual(isEmail(null), false);
  });
});
