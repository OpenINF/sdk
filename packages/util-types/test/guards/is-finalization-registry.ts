// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isFinalizationRegistry } from '../../src/guards/is-finalization-registry';

const has = typeof FinalizationRegistry !== 'undefined';
const hasStack = typeof DisposableStack !== 'undefined';

describe(isFinalizationRegistry.name, () => {
  it('should detect a FinalizationRegistry', { skip: !has }, () => {
    assert.strictEqual(
      isFinalizationRegistry(new FinalizationRegistry(() => {})),
      true
    );
  });

  it('should reject the other values of its kind', { skip: !has }, () => {
    assert.strictEqual(
      isFinalizationRegistry(new WeakRef({})),
      false,
      'WeakRef'
    );
  });

  // DisposableStack arrived after this package's minimum Node, so it gets
  // its own gate rather than riding on this guard's.
  it('should reject a DisposableStack', { skip: !has || !hasStack }, () => {
    assert.strictEqual(isFinalizationRegistry(new DisposableStack()), false);
  });

  it('should reject a plain object, and one that only claims the tag', () => {
    assert.strictEqual(isFinalizationRegistry({}), false);
    assert.strictEqual(
      isFinalizationRegistry({ [Symbol.toStringTag]: 'FinalizationRegistry' }),
      false
    );
    assert.strictEqual(isFinalizationRegistry(null), false);
  });
});
