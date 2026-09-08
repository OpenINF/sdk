// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isStringObject } from '../../src/guards/is-string-object';

describe(isStringObject.name, () => {
  it('should detect a boxed String object', () => {
    assert.strictEqual(isStringObject(new String('Foo')), true);
  });

  it('should reject a string primitive', () => {
    assert.strictEqual(isStringObject('Foo'), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isStringObject(null), false);
  });
});
