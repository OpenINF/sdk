// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isWellFormedString } from '../../src/guards/is-well-formed-string';

describe(isWellFormedString.name, () => {
  it('should accept a string with no surrogates at all', () => {
    assert.strictEqual(isWellFormedString(''), true, 'empty');
    assert.strictEqual(isWellFormedString('foo'), true, 'ascii');
    assert.strictEqual(isWellFormedString('café'), true, 'non-ascii');
  });

  it('should accept a correctly paired surrogate', () => {
    assert.strictEqual(isWellFormedString('a😀b'), true, 'emoji');
    assert.strictEqual(isWellFormedString('𐀀'), true, 'lowest pair');
    assert.strictEqual(isWellFormedString('􏿿'), true, 'highest pair');
  });

  it('should reject a lone surrogate, in either half and at either end', () => {
    assert.strictEqual(isWellFormedString('\uD800'), false, 'lone high');
    assert.strictEqual(isWellFormedString('\uDC00'), false, 'lone low');
    assert.strictEqual(isWellFormedString('a\uD800'), false, 'trailing high');
    assert.strictEqual(isWellFormedString('\uDC00b'), false, 'leading low');
    assert.strictEqual(
      isWellFormedString('\uDC00\uD800'),
      false,
      'a reversed pair'
    );
  });

  it('should agree with what encoding such a string produces', () => {
    const lone = 'a\uD800b';
    assert.strictEqual(isWellFormedString(lone), false);
    // The replacement character is what encoding a lone surrogate yields.
    assert.ok(
      new TextDecoder().decode(new TextEncoder().encode(lone)) !== lone
    );

    const paired = 'a😀b';
    assert.strictEqual(isWellFormedString(paired), true);
    assert.strictEqual(
      new TextDecoder().decode(new TextEncoder().encode(paired)),
      paired
    );
  });

  it('should refuse a String object and every non-string', () => {
    assert.strictEqual(isWellFormedString(new String('foo')), false, 'object');
    assert.strictEqual(isWellFormedString(42), false);
    assert.strictEqual(isWellFormedString(null), false);
    assert.strictEqual(isWellFormedString(undefined), false);
    assert.strictEqual(isWellFormedString(['foo']), false);
  });

  it('should carry an expectation for error messages', () => {
    assert.strictEqual(
      (isWellFormedString as { expectation?: string }).expectation,
      'be a well-formed string'
    );
  });
});
