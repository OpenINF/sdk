// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isSymbolObject } from '../../src/guards/is-symbol-object';

describe(isSymbolObject.name, () => {
  it('should detect a boxed Symbol object', () => {
    assert.strictEqual(isSymbolObject(Object(Symbol('foo'))), true);
  });

  it('should reject a symbol primitive', () => {
    assert.strictEqual(isSymbolObject(Symbol('foo')), false);
    assert.strictEqual(isSymbolObject(Symbol.iterator), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isSymbolObject(null), false);
  });
});
