// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArgumentsObject } from '../../src/guards/is-arguments-object';

function getArguments(): unknown {
  return arguments;
}

describe(isArgumentsObject.name, () => {
  it('should detect an arguments object', () => {
    assert.strictEqual(isArgumentsObject(getArguments()), true);
  });

  it('should reject an array of arguments', () => {
    assert.strictEqual(isArgumentsObject([1, 2, 3]), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isArgumentsObject(null), false);
    assert.strictEqual(isArgumentsObject(42), false);
  });
});
