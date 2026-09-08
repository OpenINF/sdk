// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isPrimitive } from '../../src/guards/is-primitive';

describe(isPrimitive.name, () => {
  it('should detect primitives', () => {
    assert.strictEqual(isPrimitive(0), true);
    assert.strictEqual(isPrimitive('foo'), true);
    assert.strictEqual(isPrimitive(false), true);
    assert.strictEqual(isPrimitive(null), true);
    assert.strictEqual(isPrimitive(undefined), true);
  });

  it('should reject non-primitives', () => {
    assert.strictEqual(isPrimitive(new Number(0)), false);
    assert.strictEqual(isPrimitive(new Boolean(true)), false);
    assert.strictEqual(isPrimitive({}), false);
    assert.strictEqual(
      isPrimitive(() => {}),
      false
    );
    assert.strictEqual(isPrimitive(new Date()), false);
  });
});
