// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertGreaterThanOrEqual } from '../../src/assertions/assert-greater-than-or-equal';

describe(assertGreaterThanOrEqual.name, () => {
  it('should not throw when a is greater than or equal to b', () => {
    assert.doesNotThrow(() => assertGreaterThanOrEqual(2, 1));
    assert.doesNotThrow(() => assertGreaterThanOrEqual(1, 1));
  });

  it('should throw when a is less than b', () => {
    assert.throws(() => assertGreaterThanOrEqual(1, 2), /Expected 1 >= 2/);
  });
});
