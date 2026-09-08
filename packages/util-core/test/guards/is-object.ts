// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isObject } from '../../src/guards/is-object';

describe(isObject.name, () => {
  it('should detect objects', () => {
    assert.strictEqual(isObject({}), true);
    assert.strictEqual(isObject([]), true);
  });

  it('should reject null and functions', () => {
    assert.strictEqual(isObject(null), false);
    assert.strictEqual(
      isObject(() => {}),
      false
    );
  });
});
