// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { deepAssign } from '../../src/helpers/deep-assign';

describe(deepAssign.name, () => {
  it('should shallowly assign top-level properties', () => {
    assert.deepStrictEqual(deepAssign({ a: 1 }, { b: 2 }), { a: 1, b: 2 });
  });

  it('should recursively merge nested objects', () => {
    const target = { a: { x: 1 } };
    const result = deepAssign(target, { a: { y: 2 } });
    assert.deepStrictEqual(result, { a: { x: 1, y: 2 } });
  });

  it('should mutate and return the target object', () => {
    const target = { a: 1 };
    assert.strictEqual(deepAssign(target, { b: 2 }), target);
  });

  it('should not copy inherited properties from sources', () => {
    const proto = { inherited: 'nope' };
    const src = Object.create(proto) as Record<string, unknown>;
    src['own'] = 'yes';
    assert.deepStrictEqual(deepAssign({}, src), { own: 'yes' });
  });
});
