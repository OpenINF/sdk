// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isFloat16Array } from '../../src/guards/is-float16-array';
import { isTypedArray } from '../../src/guards/is-typed-array';

describe(isFloat16Array.name, () => {
  it('should detect a Float16Array', () => {
    assert.strictEqual(isFloat16Array(new Float16Array()), true);
  });

  it('should reject other typed arrays', () => {
    assert.strictEqual(isFloat16Array(new Float32Array()), false);
    assert.strictEqual(isFloat16Array(new Uint8Array()), false);
  });

  it('should reject an object that only claims the tag', () => {
    assert.strictEqual(
      isFloat16Array({ [Symbol.toStringTag]: 'Float16Array' }),
      false
    );
  });

  it('should reject non-typed-array values', () => {
    assert.strictEqual(isFloat16Array([]), false);
  });

  it('should be one of the typed arrays isTypedArray accepts', () => {
    assert.strictEqual(isTypedArray(new Float16Array()), true);
  });
});
