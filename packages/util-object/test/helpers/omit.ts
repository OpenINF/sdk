// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { omit } from '../../src/helpers/omit';

describe(omit.name, () => {
  it('should remove the given properties', () => {
    assert.deepStrictEqual(omit({ a: 1, b: 2, c: 3 }, ['b']), { a: 1, c: 3 });
  });

  it('should leave the object untouched when no properties match', () => {
    assert.deepStrictEqual(omit({ a: 1 }, ['z']), { a: 1 });
  });

  // Object.keys() (and therefore omit()) only sees own enumerable
  // properties, so non-enumerable properties are never candidates for
  // removal -- they're simply never visited.
  it('should not touch non-enumerable properties', () => {
    const obj: Record<string, unknown> = { a: 1 };
    Object.defineProperty(obj, 'hidden', {
      value: 'secret',
      enumerable: false,
    });

    const result = omit(obj, ['hidden']);

    assert.deepStrictEqual(result, { a: 1 });
    assert.strictEqual(
      Object.prototype.hasOwnProperty.call(result, 'hidden'),
      false
    );
  });
});
