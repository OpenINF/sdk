// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { create } from '../../src/helpers/create';

describe(create.name, () => {
  it('should create an object with a null prototype by default', () => {
    const result = create(null, null);
    assert.strictEqual(Object.getPrototypeOf(result), null);
  });

  it('should create an object that inherits from the given prototype', () => {
    const proto = { a: 1 };
    const result = create(proto, null);
    assert.strictEqual(result['a'], 1);
    assert.deepStrictEqual(Object.keys(result), []);
  });

  it('should assign own properties from the properties object', () => {
    const result = create(null, { b: 2 });
    assert.deepStrictEqual({ ...result }, { b: 2 });
    assert.strictEqual(Object.getPrototypeOf(result), null);
  });
});
