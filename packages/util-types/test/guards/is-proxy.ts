// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isProxy } from '../../src/guards/is-proxy';

describe(isProxy.name, () => {
  it('should detect proxies', () => {
    assert.strictEqual(isProxy(new Proxy({}, {})), true);
    const { proxy, revoke } = Proxy.revocable({}, {});
    revoke();
    assert.strictEqual(isProxy(proxy), true);
    assert.strictEqual(isProxy({}), false);
    assert.strictEqual(isProxy(null), false);
  });
});
