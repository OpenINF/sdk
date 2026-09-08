// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isObjectCoercible } from '../../src/guards/is-object-coercible';

describe(isObjectCoercible.name, () => {
  it('should return true for objects, arrays, and functions', () => {
    assert.strictEqual(isObjectCoercible({}), true);
    assert.strictEqual(isObjectCoercible([]), true);
    assert.strictEqual(
      isObjectCoercible(() => {}),
      true
    );
  });

  it('should return false for primitives, since Object() wraps them', () => {
    assert.strictEqual(isObjectCoercible(1), false);
    assert.strictEqual(isObjectCoercible('a'), false);
    assert.strictEqual(isObjectCoercible(true), false);
  });

  it('should return false for null and undefined', () => {
    assert.strictEqual(isObjectCoercible(null), false);
    assert.strictEqual(isObjectCoercible(undefined), false);
  });
});
