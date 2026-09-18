// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isAsyncDisposableStack } from '../../src/guards/is-async-disposable-stack';

const has = typeof AsyncDisposableStack !== 'undefined';

describe(isAsyncDisposableStack.name, () => {
  it('should detect a AsyncDisposableStack', { skip: !has }, () => {
    assert.strictEqual(
      isAsyncDisposableStack(new AsyncDisposableStack()),
      true
    );
  });

  it('should reject the other values of its kind', { skip: !has }, () => {
    assert.strictEqual(
      isAsyncDisposableStack(new WeakRef({})),
      false,
      'WeakRef'
    );
    assert.strictEqual(
      isAsyncDisposableStack(new FinalizationRegistry(() => {})),
      false,
      'FinalizationRegistry'
    );
  });

  it('should reject a plain object, and one that only claims the tag', () => {
    assert.strictEqual(isAsyncDisposableStack({}), false);
    assert.strictEqual(
      isAsyncDisposableStack({ [Symbol.toStringTag]: 'AsyncDisposableStack' }),
      false
    );
    assert.strictEqual(isAsyncDisposableStack(null), false);
  });
});
