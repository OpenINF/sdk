// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isRegExpStringIterator } from '../../src/guards/is-reg-exp-string-iterator';

describe(isRegExpStringIterator.name, () => {
  it('should detect an RegExp String Iterator', () => {
    assert.strictEqual(isRegExpStringIterator('aa'.matchAll(/a/g)), true);
  });

  it('should reject the other iterators', () => {
    assert.strictEqual(
      isRegExpStringIterator([1, 2].values()),
      false,
      'Array Iterator'
    );
    assert.strictEqual(
      isRegExpStringIterator('ab'[Symbol.iterator]()),
      false,
      'String Iterator'
    );
  });

  it('should reject what it iterates, and a plain object', () => {
    assert.strictEqual(isRegExpStringIterator([1, 2]), false);
    assert.strictEqual(isRegExpStringIterator({}), false);
    assert.strictEqual(isRegExpStringIterator(null), false);
  });
});
