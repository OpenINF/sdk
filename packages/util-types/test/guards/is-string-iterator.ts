// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isStringIterator } from '../../src/guards/is-string-iterator';

describe(isStringIterator.name, () => {
  it('should detect an String Iterator', () => {
    assert.strictEqual(isStringIterator('ab'[Symbol.iterator]()), true);
  });

  it('should reject the other iterators', () => {
    assert.strictEqual(
      isStringIterator([1, 2].values()),
      false,
      'Array Iterator'
    );
    assert.strictEqual(
      isStringIterator('aa'.matchAll(/a/g)),
      false,
      'RegExp String Iterator'
    );
  });

  it('should reject what it iterates, and a plain object', () => {
    assert.strictEqual(isStringIterator([1, 2]), false);
    assert.strictEqual(isStringIterator({}), false);
    assert.strictEqual(isStringIterator(null), false);
  });
});
