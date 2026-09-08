// Copyright (c) The OpenINF Authors. All rights reserved.
// This code is available under the MIT license found in the LICENSE file.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { deepMixin } from '../../src/helpers/deep-mixin';

describe(deepMixin.name, () => {
  it('should copy inherited enumerable properties from sources', () => {
    const proto = { inherited: 'yes' };
    const src = Object.create(proto) as Record<string, unknown>;
    src['own'] = 'own';
    assert.deepStrictEqual(deepMixin({}, src), {
      own: 'own',
      inherited: 'yes',
    });
  });

  it('should recursively merge nested objects', () => {
    const result = deepMixin({ a: { x: 1 } }, { a: { y: 2 } });
    assert.deepStrictEqual(result, { a: { x: 1, y: 2 } });
  });
});
