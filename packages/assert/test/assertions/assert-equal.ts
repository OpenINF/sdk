// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertEqual } from '../../src/assertions/assert-equal';

describe(assertEqual.name, () => {
  it('should not throw when the values are strictly equal', () => {
    assert.doesNotThrow(() => assertEqual(1, 1));
  });

  it('should throw when the values are not strictly equal', () => {
    assert.throws(() => assertEqual(1, 2), /Expected 1 === 2/);
  });

  it('should append the provided messages', () => {
    assert.throws(() => assertEqual(1, 2, 'first', 'second'), /first second/);
  });
});
