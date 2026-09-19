// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isDetachedArrayBuffer } from '../../src/guards/is-detached-array-buffer';

const detach = (buffer: ArrayBuffer): void => {
  structuredClone(buffer, { transfer: [buffer] });
};

const has =
  typeof structuredClone === 'function' &&
  typeof Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'detached')
    ?.get === 'function';

describe(isDetachedArrayBuffer.name, () => {
  it(
    'should detect a buffer whose data has been transferred away',
    { skip: !has },
    () => {
      const buffer = new ArrayBuffer(8);
      assert.strictEqual(isDetachedArrayBuffer(buffer), false, 'before');
      detach(buffer);
      assert.strictEqual(isDetachedArrayBuffer(buffer), true, 'after');
    }
  );

  it('should reject a live buffer, resizable or not', () => {
    assert.strictEqual(isDetachedArrayBuffer(new ArrayBuffer(8)), false);
    assert.strictEqual(
      isDetachedArrayBuffer(
        Reflect.construct(ArrayBuffer, [
          8,
          { maxByteLength: 16 },
        ]) as ArrayBuffer
      ),
      false
    );
  });

  it('should reject the other buffer kinds and a view of one', () => {
    assert.strictEqual(
      isDetachedArrayBuffer(new SharedArrayBuffer(8)),
      false,
      'SharedArrayBuffer'
    );
    assert.strictEqual(
      isDetachedArrayBuffer(new Uint8Array(8)),
      false,
      'Uint8Array'
    );
    assert.strictEqual(
      isDetachedArrayBuffer(new DataView(new ArrayBuffer(8))),
      false,
      'DataView'
    );
  });

  it('should reject a plain object, and one that only claims the tag', () => {
    assert.strictEqual(isDetachedArrayBuffer({}), false);
    assert.strictEqual(
      isDetachedArrayBuffer({ [Symbol.toStringTag]: 'ArrayBuffer' }),
      false
    );
    assert.strictEqual(isDetachedArrayBuffer({ detached: true }), false);
    assert.strictEqual(isDetachedArrayBuffer(null), false);
  });
});
