// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isDisposableStack } from '../../src/guards/is-disposable-stack';

const has = typeof DisposableStack !== 'undefined';

describe(isDisposableStack.name, () => {
  it('should detect a DisposableStack', { skip: !has }, () => {
    assert.strictEqual(isDisposableStack(new DisposableStack()), true);
  });

  it('should reject the other values of its kind', { skip: !has }, () => {
    assert.strictEqual(isDisposableStack(new WeakRef({})), false, 'WeakRef');
    assert.strictEqual(
      isDisposableStack(new FinalizationRegistry(() => {})),
      false,
      'FinalizationRegistry'
    );
  });

  it('should reject a plain object, and one that only claims the tag', () => {
    assert.strictEqual(isDisposableStack({}), false);
    assert.strictEqual(
      isDisposableStack({ [Symbol.toStringTag]: 'DisposableStack' }),
      false
    );
    assert.strictEqual(isDisposableStack(null), false);
  });
});
