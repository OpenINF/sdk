// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArgValidUint32 } from '../../src/validators/is-arg-valid-uint32';

describe(isArgValidUint32.name, () => {
  it('should not throw for a valid uint32', () => {
    assert.doesNotThrow(() => isArgValidUint32(5, 'argName', false));
  });

  it('should throw for a negative number', () => {
    assert.throws(() => isArgValidUint32(-1, 'argName', false));
  });

  it('should throw for a non-number', () => {
    assert.throws(() => isArgValidUint32('abc', 'argName', false));
  });

  it('should throw for zero when positive is required', () => {
    assert.throws(() => isArgValidUint32(0, 'argName', true));
  });
});
