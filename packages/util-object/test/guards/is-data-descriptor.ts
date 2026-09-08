// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isDataDescriptor } from '../../src/guards/is-data-descriptor';

describe(isDataDescriptor.name, () => {
  it('should always return true (current stub implementation)', () => {
    assert.strictEqual(isDataDescriptor(), true);
  });
});
