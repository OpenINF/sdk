// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isWeakRef } from '../../src/guards/is-weak-ref';

const has = typeof WeakRef !== 'undefined';
const hasStack = typeof DisposableStack !== 'undefined';

describe(isWeakRef.name, () => {
  it('should detect a WeakRef', { skip: !has }, () => {
    assert.strictEqual(isWeakRef(new WeakRef({})), true);
  });

  it('should reject the other values of its kind', { skip: !has }, () => {
    assert.strictEqual(
      isWeakRef(new FinalizationRegistry(() => {})),
      false,
      'FinalizationRegistry'
    );
  });

  // DisposableStack arrived after this package's minimum Node, so it gets
  // its own gate rather than riding on this guard's.
  it('should reject a DisposableStack', { skip: !has || !hasStack }, () => {
    assert.strictEqual(isWeakRef(new DisposableStack()), false);
  });

  it('should reject a plain object, and one that only claims the tag', () => {
    assert.strictEqual(isWeakRef({}), false);
    assert.strictEqual(isWeakRef({ [Symbol.toStringTag]: 'WeakRef' }), false);
    assert.strictEqual(isWeakRef(null), false);
  });
});
