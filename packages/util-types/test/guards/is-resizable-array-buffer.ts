// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isResizableArrayBuffer } from '../../src/guards/is-resizable-array-buffer';

const has =
  typeof Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'resizable')
    ?.get === 'function';

describe(isResizableArrayBuffer.name, () => {
  it(
    'should detect a buffer constructed with a maxByteLength',
    { skip: !has },
    () => {
      assert.strictEqual(
        isResizableArrayBuffer(new ArrayBuffer(8, { maxByteLength: 16 })),
        true
      );
    }
  );

  it('should reject a fixed-length buffer', () => {
    assert.strictEqual(isResizableArrayBuffer(new ArrayBuffer(8)), false);
  });

  it('should reject a growable SharedArrayBuffer, which is the other question', () => {
    assert.strictEqual(
      isResizableArrayBuffer(new SharedArrayBuffer(8, { maxByteLength: 16 })),
      false
    );
  });

  it('should reject a plain object, and one that only claims the tag', () => {
    assert.strictEqual(isResizableArrayBuffer({}), false);
    assert.strictEqual(
      isResizableArrayBuffer({ [Symbol.toStringTag]: 'ArrayBuffer' }),
      false
    );
    assert.strictEqual(isResizableArrayBuffer({ resizable: true }), false);
    assert.strictEqual(isResizableArrayBuffer(null), false);
  });
});
