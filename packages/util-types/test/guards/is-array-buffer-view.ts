// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isArrayBufferView } from '../../src/guards/is-array-buffer-view';

describe(isArrayBufferView.name, () => {
  it('should detect a DataView', () => {
    assert.strictEqual(
      isArrayBufferView(new DataView(new ArrayBuffer(16))),
      true
    );
  });

  it('should detect a typed array', () => {
    assert.strictEqual(isArrayBufferView(new Uint8Array()), true);
  });

  it('should reject a plain ArrayBuffer', () => {
    assert.strictEqual(isArrayBufferView(new ArrayBuffer(16)), false);
  });

  it('should reject non-buffer values', () => {
    assert.strictEqual(isArrayBufferView([]), false);
  });
});
