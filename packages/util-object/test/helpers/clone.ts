// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { clone } from '../../src/helpers/clone';

describe(clone.name, () => {
  it('should shallowly clone own enumerable properties', () => {
    const original = { a: 1, b: 2 };
    const copy = clone(original);
    assert.deepStrictEqual(copy, original);
    assert.notStrictEqual(copy, original);
  });

  it('should not copy inherited properties', () => {
    const proto = { inherited: 1 };
    const obj = Object.create(proto) as Record<string, unknown>;
    obj['own'] = 2;
    assert.deepStrictEqual(clone(obj), { own: 2 });
  });
});
