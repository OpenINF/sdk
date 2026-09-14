// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isProxy } from '../../src/guards/is-proxy';

describe(isProxy.name, () => {
  it('should not detect live proxies or ordinary values', () => {
    assert.strictEqual(isProxy(new Proxy({}, {})), false);
    assert.strictEqual(isProxy({}), false);
    assert.strictEqual(isProxy(null), false);
  });

  it('should detect revoked proxies without invoking user traps', () => {
    let trapCalls = 0;
    const { proxy, revoke } = Proxy.revocable([], {
      get() {
        trapCalls += 1;
        throw new Error('must not run');
      },
    });
    revoke();
    assert.strictEqual(isProxy(proxy), true);
    assert.strictEqual(trapCalls, 0);
  });

  it('should detect a live proxy wrapping a revoked proxy', () => {
    const revocable = Proxy.revocable({}, {});
    const wrapper = new Proxy(revocable.proxy, {});
    revocable.revoke();
    assert.strictEqual(isProxy(wrapper), true);
  });
});
