// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isDataDescriptor } from '../../src/guards/is-data-descriptor';

describe(isDataDescriptor.name, () => {
  it('should detect value and writable descriptors', () => {
    assert.strictEqual(isDataDescriptor({ value: undefined }), true);
    assert.strictEqual(isDataDescriptor({ writable: false }), true);
    assert.strictEqual(
      isDataDescriptor({
        value: 1,
        writable: true,
        enumerable: false,
        configurable: true,
      }),
      true
    );
  });

  it('should reject invalid and non-data descriptors', () => {
    assert.strictEqual(isDataDescriptor({}), false);
    assert.strictEqual(isDataDescriptor({ get: () => 1 }), false);
    assert.strictEqual(isDataDescriptor({ value: 1, get: () => 1 }), false);
    assert.strictEqual(isDataDescriptor({ writable: 1 }), false);
    assert.strictEqual(
      isDataDescriptor({ value: 1, configurable: 'yes' }),
      false
    );
    assert.strictEqual(isDataDescriptor(null), false);
  });
});
