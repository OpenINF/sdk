// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isError } from '../../src/guards/is-error';

describe(isError.name, () => {
  it('should detect Errors', () => {
    assert.strictEqual(isError(new Error('foo')), true);
    assert.strictEqual(isError(new TypeError('foo')), true);
  });

  it('should reject non-Errors', () => {
    assert.strictEqual(isError({ message: 'foo', name: 'bar' }), false);
    assert.strictEqual(isError('error'), false);
    assert.strictEqual(isError(null), false);
  });
});
