// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArgValidBuffer } from '../../src/validators/is-arg-valid-buffer';

describe(isArgValidBuffer.name, () => {
  it('should not throw for a Buffer', () => {
    assert.doesNotThrow(() =>
      isArgValidBuffer(Buffer.from('foo') as any, 'buffer')
    );
  });

  it('should throw for a non-Buffer', () => {
    assert.throws(() => isArgValidBuffer([] as any, 'buffer'));
  });
});
