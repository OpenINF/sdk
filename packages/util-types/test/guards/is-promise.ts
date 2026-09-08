// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isPromise } from '../../src/guards/is-promise';
import type { Guard } from '../../src/types';

describe(isPromise.name, () => {
  it('should detect a native Promise', () => {
    assert.strictEqual(isPromise(Promise.resolve(100)), true);
  });

  it('should reject a thenable that is not a real Promise', () => {
    assert.strictEqual(isPromise({ then: function () {} }), false);
  });

  it('should reject non-object-like values', () => {
    assert.strictEqual(isPromise(100), false);
  });

  it('should set an expectation', () => {
    assert.strictEqual((isPromise as Guard).expectation, 'be a promise object');
  });
});
