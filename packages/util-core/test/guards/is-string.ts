// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isString } from '../../src/guards/is-string';

describe(isString.name, () => {
  it('should detect strings', () => {
    assert.strictEqual(isString(''), true);
    assert.strictEqual(isString('foo'), true);
    assert.strictEqual(isString(String('bar')), true);
  });

  it('should reject non-strings', () => {
    assert.strictEqual(isString(/baz/), false);
    assert.strictEqual(isString(0), false);
  });
});
