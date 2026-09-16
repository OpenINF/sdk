// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isGrowableSharedArrayBuffer } from '../../src/guards/is-growable-shared-array-buffer';

const has =
  typeof SharedArrayBuffer !== 'undefined' &&
  typeof Object.getOwnPropertyDescriptor(
    SharedArrayBuffer.prototype,
    'growable'
  )?.get === 'function';

describe(isGrowableSharedArrayBuffer.name, () => {
  it(
    'should detect a shared buffer constructed with a maxByteLength',
    { skip: !has },
    () => {
      assert.strictEqual(
        isGrowableSharedArrayBuffer(
          new SharedArrayBuffer(8, { maxByteLength: 16 })
        ),
        true
      );
    }
  );

  it('should reject a fixed-length shared buffer', { skip: !has }, () => {
    assert.strictEqual(
      isGrowableSharedArrayBuffer(new SharedArrayBuffer(8)),
      false
    );
  });

  it('should reject a resizable ArrayBuffer, which is the other question', () => {
    assert.strictEqual(
      isGrowableSharedArrayBuffer(
        Reflect.construct(ArrayBuffer, [
          8,
          { maxByteLength: 16 },
        ]) as ArrayBuffer
      ),
      false
    );
    assert.strictEqual(isGrowableSharedArrayBuffer(new ArrayBuffer(8)), false);
  });

  it('should reject a plain object, and one that only claims the tag', () => {
    assert.strictEqual(isGrowableSharedArrayBuffer({}), false);
    assert.strictEqual(
      isGrowableSharedArrayBuffer({
        [Symbol.toStringTag]: 'SharedArrayBuffer',
      }),
      false
    );
    assert.strictEqual(isGrowableSharedArrayBuffer({ growable: true }), false);
    assert.strictEqual(isGrowableSharedArrayBuffer(null), false);
  });
});
