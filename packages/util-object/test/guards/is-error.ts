// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isError } from '../../src/guards/is-error';
import { isNativeError } from '../../src/guards/is-native-error';

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

  // isError asks whether a value is Error-like; isNativeError asks whether it
  // was created as an error. These are the values they disagree about.
  it('should accept an object that only inherits from Error.prototype', () => {
    const errorLike: unknown = Object.create(Error.prototype);
    assert.strictEqual(isError(errorLike), true);
    assert.strictEqual(isNativeError(errorLike), false);
    if (typeof Error.isError === 'function') {
      assert.strictEqual(Error.isError(errorLike), false);
    }
  });

  it('should agree with isNativeError about a real error', () => {
    assert.strictEqual(isError(new TypeError('x')), true);
    assert.strictEqual(isNativeError(new TypeError('x')), true);
  });
});
