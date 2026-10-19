// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hasUnicode } from '../../src/_internal/has-unicode';

describe(hasUnicode.name, () => {
  it('should say false, not throw, where there is no process', () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'process');
    assert.ok(descriptor !== undefined);
    Reflect.deleteProperty(globalThis, 'process');
    try {
      assert.strictEqual(hasUnicode(), false);
    } finally {
      Object.defineProperty(globalThis, 'process', descriptor);
    }
  });
});
