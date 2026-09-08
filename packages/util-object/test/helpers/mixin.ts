// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { mixin } from '../../src/helpers/mixin';

describe(mixin.name, () => {
  it('should copy inherited enumerable properties from sources', () => {
    const proto = { inherited: 1 };
    const src = Object.create(proto) as Record<string, unknown>;
    src['own'] = 2;
    assert.deepStrictEqual(mixin({}, src), { inherited: 1, own: 2 });
  });

  it('should assign nested objects by reference rather than deep-copying', () => {
    const nested = { x: 1 };
    const result = mixin({}, { a: nested });
    assert.strictEqual(result.a, nested);
  });

  it('should mutate and return the target object', () => {
    const target = { a: 1 };
    assert.strictEqual(mixin(target, { b: 2 }), target);
  });
});
