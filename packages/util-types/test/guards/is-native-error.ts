// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isNativeError } from '../../src/guards/is-native-error';

describe(isNativeError.name, () => {
  it('should detect a native Error', () => {
    assert.strictEqual(isNativeError(new Error('boom')), true);
  });

  it('should detect Error subclasses', () => {
    assert.strictEqual(isNativeError(new TypeError('boom')), true);
    assert.strictEqual(isNativeError(new RangeError('boom')), true);
  });

  it('should reject non-error values', () => {
    assert.strictEqual(isNativeError({ message: 'boom' }), false);
    assert.strictEqual(isNativeError('boom'), false);
  });
});
