// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isAccessorDescriptor } from '../../src/guards/is-accessor-descriptor';

describe(isAccessorDescriptor.name, () => {
  it('should always return true (current stub implementation)', () => {
    assert.strictEqual(isAccessorDescriptor(), true);
  });
});
