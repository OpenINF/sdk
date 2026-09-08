// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertLessThan } from '../../src/assertions/assert-less-than';

describe(assertLessThan.name, () => {
  it('should not throw when a is less than b', () => {
    assert.doesNotThrow(() => assertLessThan(1, 2));
  });

  it('should throw when a is greater than or equal to b', () => {
    assert.throws(() => assertLessThan(2, 1), /Expected 2 < 1/);
    assert.throws(() => assertLessThan(1, 1), /Expected 1 < 1/);
  });

  it('should append a provided message', () => {
    assert.throws(() => assertLessThan(2, 1, 'custom'), /custom/);
  });
});
