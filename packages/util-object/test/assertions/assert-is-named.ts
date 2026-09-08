// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertIsNamed } from '../../src/assertions/assert-is-named';

describe(assertIsNamed.name, () => {
  it('should not throw for a named value', () => {
    assert.doesNotThrow(() => assertIsNamed({ name: 'Derek' }));
  });

  it('should throw for a value without a string name', () => {
    assert.throws(() => assertIsNamed({}), /Expected value to be named/);
    assert.throws(() => assertIsNamed({ name: 1000 }));
  });

  it('should use a custom message when provided', () => {
    assert.throws(
      () => assertIsNamed(null, 'custom message'),
      /custom message/
    );
  });
});
