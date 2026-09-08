// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isSymbol } from '../../src/guards/is-symbol';

describe(isSymbol.name, () => {
  it('should detect symbols', () => {
    assert.strictEqual(isSymbol(Symbol('foo')), true);
    assert.strictEqual(isSymbol(Symbol.iterator), true);
  });

  it('should reject non-symbols', () => {
    assert.strictEqual(isSymbol('@#$%&!'), false);
    assert.strictEqual(isSymbol(0), false);
  });
});
