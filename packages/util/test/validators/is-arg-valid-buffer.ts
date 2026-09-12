// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArgValidBuffer } from '../../src/validators/is-arg-valid-buffer';

describe(isArgValidBuffer.name, () => {
  it('should accept every ArrayBuffer view named by its contract', () => {
    assert.doesNotThrow(() => isArgValidBuffer(Buffer.from('foo'), 'buffer'));
    assert.doesNotThrow(() =>
      isArgValidBuffer(new Uint16Array(2), 'typedArray')
    );
    assert.doesNotThrow(() =>
      isArgValidBuffer(new DataView(new ArrayBuffer(4)), 'dataView')
    );
  });

  it('should reject values that are not ArrayBuffer views', () => {
    assert.throws(() => isArgValidBuffer([], 'buffer'));
    assert.throws(() => isArgValidBuffer(new ArrayBuffer(4), 'buffer'));
  });
});
