// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isAccessorDescriptor } from '../../src/guards/is-accessor-descriptor';

describe(isAccessorDescriptor.name, () => {
  it('should detect getter and setter descriptors', () => {
    assert.strictEqual(isAccessorDescriptor({ get: () => 1 }), true);
    assert.strictEqual(
      isAccessorDescriptor({ set: (_value: number) => {} }),
      true
    );
    assert.strictEqual(
      isAccessorDescriptor({
        get: undefined,
        set: undefined,
        enumerable: false,
        configurable: true,
      }),
      true
    );
  });

  it('should reject invalid and non-accessor descriptors', () => {
    assert.strictEqual(isAccessorDescriptor({}), false);
    assert.strictEqual(isAccessorDescriptor({ value: 1 }), false);
    assert.strictEqual(isAccessorDescriptor({ get: () => 1, value: 1 }), false);
    assert.strictEqual(isAccessorDescriptor({ get: 1 }), false);
    assert.strictEqual(isAccessorDescriptor({ set: 'setter' }), false);
    assert.strictEqual(
      isAccessorDescriptor({ get: undefined, enumerable: 1 }),
      false
    );
    assert.strictEqual(isAccessorDescriptor(null), false);
  });
});
