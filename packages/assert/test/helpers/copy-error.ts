// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { copyError } from '../../src/helpers/copy-error';

describe(copyError.name, () => {
  it('should create a distinct copy with the same message', () => {
    const original = new TypeError('boom');
    const copy = copyError(original);
    assert.notStrictEqual(copy, original);
    assert.strictEqual(copy.message, 'boom');
  });

  it('should preserve the prototype', () => {
    const original = new TypeError('boom');
    const copy = copyError(original);
    assert.ok(copy instanceof TypeError);
  });

  it('should copy own enumerable properties', () => {
    const original = new Error('boom') as Error & { extra: string };
    original.extra = 'x';
    const copy = copyError(original) as Error & { extra: string };
    assert.strictEqual(copy.extra, 'x');
  });

  it('should preserve every own property descriptor', () => {
    const marker = Symbol('marker');
    const cause = new Error('cause');
    const original = new Error('boom', { cause }) as Error & {
      [marker]?: string;
    };
    Object.defineProperty(original, 'hidden', {
      configurable: true,
      value: 42,
    });
    original[marker] = 'symbol value';

    const copy = copyError(original);
    assert.deepStrictEqual(Reflect.ownKeys(copy), Reflect.ownKeys(original));
    for (const key of Reflect.ownKeys(original)) {
      assert.deepStrictEqual(
        Object.getOwnPropertyDescriptor(copy, key),
        Object.getOwnPropertyDescriptor(original, key)
      );
    }
  });
});
