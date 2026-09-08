// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { maybeUnboxNumber } from '../src/maybe-unbox-number';

describe(maybeUnboxNumber.name, () => {
  it('should unbox a boxed Number object', () => {
    assert.strictEqual(maybeUnboxNumber(Object(42)), 42);
  });

  it('should return a number primitive unchanged', () => {
    assert.strictEqual(maybeUnboxNumber(42), 42);
  });
});
