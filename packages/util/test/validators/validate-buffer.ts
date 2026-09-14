// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateBuffer } from '../../src/validators/validate-buffer';

describe(validateBuffer.name, () => {
  it('should accept every ArrayBuffer view named by its contract', () => {
    assert.doesNotThrow(() => validateBuffer(Buffer.from('foo'), 'buffer'));
    assert.doesNotThrow(() => validateBuffer(new Uint16Array(2), 'typedArray'));
    assert.doesNotThrow(() =>
      validateBuffer(new DataView(new ArrayBuffer(4)), 'dataView')
    );
  });

  it('should reject values that are not ArrayBuffer views', () => {
    assert.throws(() => validateBuffer([], 'buffer'));
    assert.throws(() => validateBuffer(new ArrayBuffer(4), 'buffer'));
  });
});
