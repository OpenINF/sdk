// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isEmail, type Email } from '../../src/index';

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

  it('should preserve the existing basic email syntax', () => {
    for (const value of [
      'a+b@example.com',
      'a@example.co.uk',
      'a..b@example.com',
      'a@..b',
      'a@b..',
    ]) {
      assert.strictEqual(isEmail(value), true, value);
    }
    for (const value of [
      '',
      '@example.com',
      'a@@example.com',
      'a@.com',
      'a@example.',
      'a@localhost',
    ]) {
      assert.strictEqual(isEmail(value), false, value);
    }
  });

  it('should reject whitespace, including trailing line endings', () => {
    for (const whitespace of [' ', '\t', '\r', '\n', '\r\n', '\u00A0']) {
      assert.strictEqual(isEmail(`foo@example.com${whitespace}`), false);
      assert.strictEqual(isEmail(`foo${whitespace}@example.com`), false);
    }
  });

  it('should reject a long invalid address without quadratic backtracking', () => {
    const value = `a@${'.'.repeat(64_000)} `;
    const start = Date.now();
    assert.strictEqual(isEmail(value), false);
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 2000, `expected under 2s, took ${elapsed}ms`);
  });

  it('should narrow only accepted strings to Email', () => {
    function check(value: string | number): boolean {
      if (isEmail(value)) {
        const email: Email = value;
        assert.strictEqual(typeof email, 'string');
        return true;
      }

      // A failed syntax check must not exclude all strings from the union.
      const rejectedString: typeof value = 'not an email';
      assert.strictEqual(typeof rejectedString, 'string');
      return false;
    }

    assert.strictEqual(check('foo@example.com'), true);
    assert.strictEqual(check('not an email'), false);
    assert.strictEqual(check(42), false);
  });
});
