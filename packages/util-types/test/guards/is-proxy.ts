// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isProxy } from '../../src/guards/is-proxy';

describe(isProxy.name, () => {
  it('should always return false', () => {
    assert.strictEqual(isProxy(new Proxy({}, {})), false);
    assert.strictEqual(isProxy({}), false);
    assert.strictEqual(isProxy(null), false);
  });
});
