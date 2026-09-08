// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isFunction } from '../../src/guards/is-function';

describe(isFunction.name, () => {
  it('should detect functions', () => {
    assert.strictEqual(isFunction(class Foo {}), true);
    assert.strictEqual(
      isFunction(() => {}),
      true
    );
    assert.strictEqual(
      isFunction(async () => {}),
      true
    );
    assert.strictEqual(
      isFunction(function* bar() {}),
      true
    );
    assert.strictEqual(isFunction(Math.round), true);
  });

  it('should reject non-functions', () => {
    assert.strictEqual(isFunction(/abc/), false);
    assert.strictEqual(isFunction({}), false);
  });
});
